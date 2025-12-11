export interface User {
    id: string;
    username: string;
    created_at: number;
}

export interface Board {
    id: string;
    user_id: string;
    title: string;
    created_at: number;
}

export interface List {
    id: string;
    board_id: string;
    title: string;
    position: number;
    created_at: number;
}

export interface Card {
    id: string;
    list_id: string;
    title: string;
    description: string | null;
    position: number;
    created_at: number;
}
