import { Genere } from "./genere";
import { Source } from "./source";
import { Trailer } from "./trailer";

export class Poster {

    _id?: string;
    id?: number;
    title?: string;
    description?: string;
    rating?: number;
    label?: string;
    sublabel?: string;
    type?: string;
    year?: string;
    imdb?: number;
    comment?: boolean;
    duration?: string;
    downloadas?: number;
    playas?: number;
    classification?: string;
    image?: string;
    cover?: string;
    genres?: Genere[];
    trailer?: Trailer;
    sources?: Source[];
  
    tags?: string[];
    enable_comments?: boolean;
    categories?: { _id: string; name: string }[];
    sourceUrl_language_files?: { [key: string]: string[] };
    poster?: string;
    banner?: string;
    subtitles_language_files?: {}[];
    guid?: number;
    created_at?: string;
    updated_at?: string;
    
    constructor(values: object = {})
    {
        Object.assign(this,values);
    }
}