import os
import base64
import requests
from googleapiclient.discovery import build
from google.protobuf import descriptor_pb2, message_factory
from dotenv import load_dotenv

load_dotenv()

def create_youtube_client():
    """Creates a YouTube client using the API key from environment variables."""
    api_key = os.environ.get('YOUTUBE_API_KEY')
    return build('youtube', 'v3', developerKey=api_key)


def get_base64_protobuf(message):
    """Encodes a message into a base64-encoded protobuf for YouTube InnerTube API."""
    # Create the descriptor for message
    file_descriptor_proto = descriptor_pb2.FileDescriptorProto()
    file_descriptor_proto.name = "dynamic_message.proto"
    file_descriptor_proto.package = "dynamic_package"
    
    # Create message descriptor
    message_descriptor_proto = descriptor_pb2.DescriptorProto()
    message_descriptor_proto.name = "Message"
    
    # Add fields to message descriptor
    field1 = message_descriptor_proto.field.add()
    field1.name = "param1"
    field1.number = 1
    field1.type = descriptor_pb2.FieldDescriptorProto.TYPE_STRING
    field1.label = descriptor_pb2.FieldDescriptorProto.LABEL_OPTIONAL
    
    field2 = message_descriptor_proto.field.add()
    field2.name = "param2"
    field2.number = 2
    field2.type = descriptor_pb2.FieldDescriptorProto.TYPE_STRING
    field2.label = descriptor_pb2.FieldDescriptorProto.LABEL_OPTIONAL
    
    # Add message type to file descriptor
    file_descriptor_proto.message_type.add().CopyFrom(message_descriptor_proto)
    
    # Create message class from file descriptor
    message_class = message_factory.GetMessages([file_descriptor_proto])['dynamic_package.Message']
    
    # Create message instance and set fields
    msg = message_class()
    if 'param1' in message and message['param1'] is not None:
        msg.param1 = message['param1']
    if 'param2' in message and message['param2'] is not None:
        msg.param2 = message['param2']
    
    # Serialize and encode
    binary = msg.SerializeToString()
    return base64.b64encode(binary).decode('utf-8')

def get_default_subtitle_language(video_id):
    """Returns the default subtitle language of a YouTube video."""
    youtube = create_youtube_client()
    
    # Get video default language
    videos = youtube.videos().list(
        part='snippet',
        id=video_id
    ).execute()
    
    if not videos.get('items') or len(videos['items']) != 1:
        raise Exception(f"Multiple videos found for video: {video_id}")
    
    video_snippet = videos['items'][0]['snippet']  # Fixed indexing
    preferred_language = video_snippet.get('defaultLanguage') or video_snippet.get('defaultAudioLanguage')
    
    # Get available subtitles
    subtitles = youtube.captions().list(
        part='snippet',
        videoId=video_id
    ).execute()
    
    if not subtitles.get('items') or len(subtitles['items']) < 1:
        raise Exception(f"No subtitles found for video: {video_id}")
    
    # Find subtitle in preferred language or use first available
    subtitle = None
    for sub in subtitles['items']:
        if sub['snippet']['language'] == preferred_language:
            subtitle = sub
            break
    
    if subtitle is None:
        subtitle = subtitles['items'][0]  # Fixed indexing
        
    return {
        'trackKind': subtitle['snippet']['trackKind'],
        'language': subtitle['snippet']['language']
    }

def extract_text(item):
    """Extracts text from YouTube elements."""
    if 'simpleText' in item:
        return item['simpleText']
    elif 'runs' in item:
        return ''.join(run.get('text', '') for run in item['runs'])
    return ''

def get_subtitles(options):
    """Retrieves subtitles for a YouTube video using InnerTube API."""
    video_id = options.get('videoId')
    language = options.get('language')
    track_kind = options.get('trackKind')
    
    # Create inner message for protobuf encoding
    inner_message = {
        'param1': track_kind if track_kind == 'asr' else None,
        'param2': language
    }
    
    # Encode inner message
    inner_encoded = get_base64_protobuf(inner_message)
    
    # Create outer message
    message = {
        'param1': video_id,
        'param2': inner_encoded
    }
    
    # Encode outer message
    params = get_base64_protobuf(message)
    
    # Prepare request
    url = 'https://www.youtube.com/youtubei/v1/get_transcript'
    headers = {'Content-Type': 'application/json'}
    data = {
        'context': {
            'client': {
                'clientName': 'WEB',
                'clientVersion': '2.20240826.01.00'
            }
        },
        'params': params
    }
    
    # Make request
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Error retrieving subtitles: {response.status_code}")
    
    # Parse response
    response_data = response.json()
    
    # Fixed dictionary access path
    initial_segments = response_data['actions'][0]['updateEngagementPanelAction']['content']\
        ['transcriptRenderer']['content']['transcriptSearchPanelRenderer']['body']\
        ['transcriptSegmentListRenderer']['initialSegments']
        
    if not initial_segments:
        raise Exception(f"Requested transcript does not exist for video: {video_id}")
    
    subtitles = ""
    for segment in initial_segments:
        line = segment.get('transcriptSectionHeaderRenderer') or segment.get('transcriptSegmentRenderer')
        text = extract_text(line.get('snippet', {}))
        subtitles += text + ". "
        
    return subtitles

def fetch_transcript(video_id):
    """Main function to get subtitles for a YouTube video."""
    try:
        # Get default subtitle language
        language_info = get_default_subtitle_language(video_id)
        
        # Get subtitles
        subtitles = get_subtitles({
            'videoId': video_id,
            'language': language_info['language'],
            'trackKind': language_info['trackKind']
        })
        
        return subtitles
    except Exception as e:
        print(f"Error from get_transcript: {str(e)}")
        return None
