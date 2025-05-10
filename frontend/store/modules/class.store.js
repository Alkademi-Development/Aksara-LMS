import {
    apiGetClassOverview,
} from '@/api/class.api';

export default {
    namespaced: true,
    state: {
        data: null,
        status: false,
        message: '',
    },

    mutations: {
        SET_RESPONSE(state, {message, status, data}){
            state.message = message;
            state.status = status;
            state.data = data;
        },
    },

    actions: {
        async overview({commit}, { slug }) {
            try {
                // const response = await apiGetClassOverview(slug);
                const response = null;

                const resPayload = {
                    message: '',
                    status: true,
                    data: {
                        "id": 518,
                        "code": "P179C518",
                        "name": "Fundamental C++ Programming",
                        "slug": "fundamental-c---programming",
                        "logo": "https://drive.alkademi.id/v1/upload/class/1740977644798.png",
                        "description": "\u003cp\u003e\u003cstrong\u003eC++\u003c/strong\u003e is a powerful programming language widely used in software development, operating systems, and game development. In this class, participants will learn the fundamentals of C++, including basic syntax, variables, data types, operators, control flow, functions, and the basics of object-oriented programming. This class is ideal for those who want to understand low-level programming concepts and build high-performance applications.\u003c/p\u003e",
                        "visibility": "public",
                        "quota": -1,
                        "state": "release",
                        "tags": "c++, softwaredevelopment",
                        "level": 0,
                        "mode": "online",
                        "minScore": 80,
                        "minPrecence": 0,
                        "programId": 179,
                        "programName": "Software Development",
                        "programLogo": "https://drive.alkademi.id/v1/upload/program/1740973281998.png",
                        "groupLink": "",
                        "attendanceId": 0,
                        "preClassId": 517,
                        "authorId": 96,
                        "discussionLink": "",
                        "hasPretest": 0,
                        "requirementFields": [
                            "{\"name\":\"gender\",\"isReq\":false}",
                            "{\"name\":\"portfolio\",\"isReq\":false}",
                            "{\"name\":\"cityId\",\"isReq\":true}",
                            "{\"name\":\"github\",\"isReq\":true}",
                            "{\"name\":\"linkedIn\",\"isReq\":false}"
                        ],
                        "certificate": {
                            "template": "alkademi",
                            "images": {},
                            "logos": [],
                            "signatures": [
                                {
                                    "name": "Dyan R. Helmi",
                                    "job": "Founder \u0026 CEO Alkademi",
                                    "signature": "https://drive.alkamedia.id/v1/upload/assets/img/alkademi_kanghelmi.png"
                                }
                            ],
                            "content": ""
                        },
                        "certificateRelease": null,
                        "tasks": 0,
                        "taskSubmitted": 0,
                        "start": null,
                        "end": null,
                        "registrationStart": null,
                        "registrationEnd": null,
                        "totalStudent": 4,
                        "price": 0,
                        "userState": null,
                        "registered": false,
                        "alwaysOpen": true,
                        "type": "bootcamp",
                        "minPretestScore": -1,
                        "meetLevels": true,
                        "author": {
                            "id": 96,
                            "name": "Alkademi Foundation",
                            "photo": "https://drive.alkademi.id/v1/upload/profile/1741075940386.jpg",
                            "bio": "-",
                            "job": "",
                            "institution": ""
                        },
                        "mentors": null,
                        "heldCity": [
                            {
                                "created_at": "2022-11-25T23:16:27.137675Z",
                                "id": 0,
                                "kind": 1,
                                "name": "SEMUA KOTA",
                                "provinceId": 0,
                                "slug": null,
                                "updated_at": "2022-11-25T23:16:27.137675Z",
                                "uuid": null
                            }
                        ],
                        "registrarCity": [
                            {
                                "created_at": "2022-11-25T23:16:27.137675Z",
                                "id": 0,
                                "kind": 2,
                                "name": "SEMUA KOTA",
                                "provinceId": 0,
                                "slug": null,
                                "updated_at": "2022-11-25T23:16:27.137675Z",
                                "uuid": null
                            }
                        ],
                        "pretest": 0,
                        "modules": [
                            752
                        ],
                        "preClass": {
                            "id": 517,
                            "name": "Computational Thinking",
                            "slug": "computational-thinking-1"
                        },
                        "classState": {
                            "onRegistration": true,
                            "started": true,
                            "ended": false,
                            "comingSoon": false
                        },
                        "schools": null,
                        "schoolId": 0,
                        "school": "",
                        "recurse": null
                    }
                }

                commit('SET_RESPONSE', resPayload);
            } catch (error) {
                const resPayload = {
                    message: error,
                    status: false,
                    data: null
                }

                commit('SET_RESPONSE', resPayload);
            }
        },
    }
}