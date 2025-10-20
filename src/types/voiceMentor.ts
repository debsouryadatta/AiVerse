
export interface VoiceMentorModel {
    id: string;
    name: string;
    description: string;
    voiceId: string;
    chatHistory: any[];
    lastUsed?: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type Message = {
    sender: string;
    response: string;
    id: string;
};