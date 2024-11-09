from app.generate.subtopics import generate_subtopics
from app.generate.subtopics_expl import generate_subtopic_explanations
from app.generate.youtube import generate_youtube


async def generate_chapter(chapter: str):
    subtopics = await generate_subtopics(chapter)
    subtopic_explanations = await generate_subtopic_explanations(subtopics)
    youtube = await generate_youtube(chapter)
    return {
        "title": chapter,
        "subtopics": subtopics['subtopics'],
        "subtopicExplanations": subtopic_explanations,
        "youtubeSearchQuery": youtube['youtubeQuery'],
        "videoId": youtube['youtubeVideoId'],
        "summary": youtube['transcriptSummary']
    }