export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

import Peer from 'simple-peer'



declare global {

    interface IRole {
        _id: string;
        name: string;
        permissions: [
            {
                _id: string
                name: string
            },

        ],
        money: string
    }


    interface ISong {
        "_id": string,
        "name": string,
        "users": [
            {
                "_id": string,
                "name": string
            }
        ],
        "audio": string,
        "cover": string,
        "genres": string[],
        "totalListen": [
            {
                "_id": string,
                "date": Date
            }
        ],
        "like": string[],
        "dislike": string[],
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createBy": {
            "_id": string,
            "name": string,
            "avatar": string;
            "following": string[];
            "followers": string[];
        },
        "createdAt": Date,
        "updatedAt": Date,
        "state": string,
        "isVip": boolean

    }



    interface ISongContextCurrent extends ISong {
        isPlayCurrent: boolean,
        duration: number;
        current: number;

    }


    interface IGroup {
        "IsActive": boolean,
        "avatar": string,
        "_id": string,
        "name": string,
        "adminGroup": string[],
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createdAt": Date,
        "updatedAt": Date,
        "members": [
            {
                "_id": string,
                "name": string,
                "avatar": string,
                "following": string[],
                "followers": string[]
            }
        ]
    }

    interface ISongPlaylist {
        "_id": string,
        "userID": string
        "songID": ISong[],
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createdAt": Date,
        "updatedAt": Date,
    }

    interface ISongHistory {
        "_id": string,
        "userID": string
        "songID": ISong[],
        "start": number,
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createdAt": Date,
        "updatedAt": Date,
    }






    interface IHistory {
        "_id": string,
        "userID": string,
        "songID": [
            {
                "_id": string,
                "name": string,
                "users": [
                    {
                        "_id": string,
                        "name": string,
                    }
                ],
                "audio": string,
                "cover": string,
                "like": string[],
                "dislike": string[],
                "totalListen": string[],
            }
        ],
        "start": number,
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createdAt": Date,
        "updatedAt": Date,
    }



    interface Session {
        "access_token": string,
        "_id": string,
        "name": string,
        "email": string,
        "avatar": string,
        "countFollowers": number,
        "typeLogin": string,
        "followers": string[],
        "following": string[]
    }

    interface IComment {
        "_id": string,
        "userID": {
            "_id": string,
            "name": string,
            "avatar": string,
            "countFollower": number
        },
        "songID": string,
        "IsAction": boolean,
        "content": string,
        "ghimSecond": number,
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "createdAt": Date,
        "updatedAt": Date,
    }


    interface IUser {
        "typeLogin": string,
        "_id": string,
        "name": string,
        "email": string,
        "avatar": string,
        "isDeleted": boolean,
        "deletedAt": Date | null,
        "following": [
            {
                "_id": string,
                "name": string,
                "email": string,
                "avatar": string,
                "followers": string[]
            }
        ],
        "followers": [
            {
                "_id": string,
                "name": string,
                "email": string,
                "avatar": string,
                "followers": string[]
            }
        ],
        "createdAt": Date,
        "updatedAt": Date,
        "shared": string[],
    }


    interface IBasicUser {
        "_id": string,
        "name": string,
        "socketId": string,
        "avatar": string,
    }



    interface Message {
        "user": IBasicUser,
        "timeSent": string,
        "message": string
        "roomName": string
    }


    interface UserType {
        _id: string;
        name: string;
        email: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }


    interface ChatType {
        _id: string;
        users: UserType[];
        createdBy: UserType;
        lastMessage: MessageType;
        isGroupChat: boolean;
        groupName: string;
        groupProfilePicture: string;
        groupBio: string;
        groupAdmins: UserType[];
        unreadCounts: any;
        createdAt: Date;
        updatedAt: Date;
    }

    interface MessageType {
        _id: string;
        socketMessageId: string;
        chat: ChatType;
        sender: UserType;
        text: string;
        image: string;
        readBy: string[];
        isDeleted: boolean,
        deletedAt: Date | null,
        createdAt: Date;
        updatedAt: Date;
    }


    interface IChat {
        _id: string,
        users: UserType[],
        lastMessageAt: Date | string,
        createdBy: UserType,
        isGroupChat: boolean,
        groupName: string,
        groupProfilePicture: string,
        groupBio: string,
        groupAdmins: string[],
        isDeleted: boolean,
        deletedAt: Date | null,
        createdAt: Date,
        updatedAt: Date,
        lastMessage: MessageType,
        unreadCounts: string[]

    }
    interface AlbumType {
        _id: string,
        name: string,
        description: string
    }

    interface Genre {
        _id: string,
        name: string,
        descriptions: string,

    }

    interface InfoCallUser {
        fromUserID: string,
        ToUserID: string,
        callerName: string;
        callerAvatar: string;
        receivedName: string;
        receivedAvatar: string;
        chatID: string;
        socketID: string
    }
    interface IWaveSurferContextValue {
        current: IWaveSurferContext;
        setCurrent: React.Dispatch<React.SetStateAction<IWaveSurferContext>>;
    }

    interface IWaveSurferContext {
        currentTime: number;
    }


    interface PeerData {
        peerConnection: Peer.Instance,
        stream: MediaStream | undefined,
        userID: string,
        socketID: string

    }

    interface ICall {
        _id: string,
        callID: string,
        adminID: {
            _id: string,
            name: string,
            avatar: string
        }
    }

    interface IZoom {
        _id: string,
        name: string,
        adminID: string,
        chat: {
            _id: string,
            users: [
                {
                    _id: string,
                    name: string,
                    avatar: string,
                }
            ]
        },
        isDeleted: boolean,
        deletedAt: null | Date,
        createdAt: Date,
        updatedAt: Date,

    }


    interface UserInfoUpdateRole {
        userId: string,
        userName: string,
        vipName: string
    }



    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }


    interface ICourse {
        id: number;
        subject: string;
        image: string;
        category: number;
        category_name: string;
        total_student: number;
        lecturer: number;
        lecturer_name: string;
        name: string;
        description: string;
        price: string; // có thể đổi thành number nếu bạn muốn parse
        level: string;
        duration: number;
        lessons_count: number;
        created_at: string; // hoặc Date nếu bạn parse
    }

    interface ILecturer {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        avatar: string | null;
        address: string | null;
        introduce: string | null;
        phone: string | null;
        date_joined: string;   // có thể đổi sang Date nếu bạn parse
        userRole: string;      // "teacher" | "student" nếu có enum
        is_active: boolean;

    }

    export interface IDocument {
        id: number;
        lesson: number;
        name: string;
        file_url: string;
        type: string;
        active: boolean;
        created_at: string;
        updated_at?: string | null;
    }

    export interface ILesson {
        id: number;
        chapter: number;
        name: string;
        description: string;
        type: string;
        video_url: string;
        duration: number; // tính bằng giây
        is_published: boolean;
        active: boolean;
        created_at: string;
        updated_at?: string | null;
        documents: IDocument[];
    }

    export interface IChapter {
        id: number;
        course: number;
        name: string;
        description: string;
        is_published: boolean;
        active: boolean;
        created_at: string;
        updated_at?: string | null;
        lessons: ILesson[];
    }


    interface ICourseDetail {
        id: number;
        name: string;
        description: string;
        price: string;
        level: "so_cap" | "trung_cap" | "cao_cap";
        duration: number; // giây
        thumbnail_url: string | null;
        learning_outcomes: string;
        requirements: string;
        video_url: string;
        lecturer: ILecturer;
        students_count: number;
        lessons_count: number;
        chapters: IChapter[];
        subject?: string;
        image?: string;
        category?: {
            id: number;
            name: string;
        };
        related_courses?: ICourse[];
        is_enrolled?: boolean;
    }


    interface IForum {
        id: number;
        name: string;
        description: string;
        course: number;
        user: string;
        is_locked: boolean;
        active: boolean;
        created_at: string;
    }

    interface ITopic {
        id: number;
        forum: number;
        user: string;
        title: string;
        content: string;
        is_pinned: boolean;
        is_locked: boolean;
        view_count: number;
        last_activity: string;
        comment_count: number;
        last_comment: {
            user: string;
            content: string;
            created_at: string;
        } | null;
        created_at: string;
    }

    interface IComment {
        id: number;
        user: string;
        user_avatar: string | null;
        forum: number | null;
        topic: number | null;
        parent: number | null;
        content: string;
        replies: IComment[];
        created_at: string;
    }


}
