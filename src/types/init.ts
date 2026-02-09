export const init: ISong = {
    _id: "",
    name: "",
    users: [
        {
            _id: "",
            name: ""
        }
    ],
    audio: "",
    cover: "",
    genres: [],
    totalListen: [
        {
            _id: "",
            date: new Date()
        }
    ],
    like: [],
    dislike: [],
    isDeleted: false,
    deletedAt: null,
    isVip: false,
    createBy: {
        _id: "",
        name: "",
        avatar: "",
        following: [],
        followers: []
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    state: ""
};
