<template>
    <div :class="['chats', isMobile && role != 'superadmin' && role != 'admin' ? 'is-mobile' : '']">
        <!-- Header -->
        <div :class="['bg-secondary text-white header', 'px-3 py-2']">

            <template v-if="!isDetail">
                <h4 v-if="!isSearch">Pesan</h4>
                
                <b-form v-else @submit="submitSearch" class="w-100">
                    <b-form-input
                        placeholder="Cari seseorang"
                        v-model="textSearch"
                        type="text"
                    ></b-form-input>
                </b-form>

                <div class="icon-search" @click="toggleSearch">
                    <i v-if="!isSearch" class="fas fa-search"></i>
                    <i v-else class="fas fa-times"></i>
                </div>
            </template>

            <template v-if="isDetail && dataChat != null">

                <div class="btn-back" @click="toggleDetail">
                    <i class="fas fa-arrow-left" ></i>
                </div>

                <div class="img-profile">
                    <b-avatar
                    size="3rem"
                    variant="info"
                    :src="dataChat.photo != null ? dataChat.photo : ''"
                    :text="dataChat.name[0]"
                    ></b-avatar>
                </div>

                <h4 class="name">{{dataChat.name}}</h4>

            </template>

        </div>

        <!-- List -->
        <div v-if="!isDetail && isChatsLoaded" class="list-group list-group-flush">

            <div v-if="listChat.length != 0" class="list-chats" ref="list-chats">

                <div
                    :class="[
                        'cursor-pointer',
                        'list-group-item',
                        'list-group-item-action',
                        item.readed == 0 ? 'bg-light' : '',
                    ]"
                    v-for="item in listChat"
                    :key="item.id"
                    @click="toggleDetail(item)"
                >

                    <div class="row align-items-center">

                        <div class="col">

                            <div class="d-flex justify-content-between align-items-center">

                                <div class="d-flex align-items-center">

                                    <b-avatar
                                        size="3rem"
                                        variant="info"
                                        :src="item.photo != null ? item.photo : ''"
                                        :text="item.name[0]"
                                        class="mr-3"
                                    ></b-avatar>

                                    <div class="chats-user">
                                        <h5 class="mb-0 name">{{ item.name }}</h5>
                                        <small class="mb-0 text-muted message" v-if="item.lastMessage != undefined">{{item.lastMessage.senderId == user.id ? `&bull; ${item.lastMessage.message}` : item.lastMessage.message }}</small>
                                    </div>

                                </div>

                                <div class="text-right text-muted">

                                    <small v-if="item.lastMessage != undefined" :class="[item.lastMessage.senderId == user.id ? '' : item.unreaded >= 1 ? 'text-danger' : '']">{{item.lastMessage.created_at | date}}</small>
                                    <!-- <small v-if="item.lastMessage != undefined">{{item.lastMessage.created_at | date}}</small> -->


                                    <div class="d-flex justify-content-end">

                                        <div
                                        v-if="item.unreaded >= 1"
                                        class="badge badge-pill badge-danger"
                                        >
                                        {{ item.unreaded }}
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <small v-if="isLoadMore" class="d-flex justify-content-center align-items-center w-100">Memuat...</small>
            </div>

            <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
                <small>{{isSearch ? "User tidak ditemukan" : "Belum ada chat"}}</small>
            </div>
            
        </div>

        <!-- <div v-else-if="!isDetail && !isChatsLoaded" class="w-100 h-100 d-flex align-items-center justify-content-center">
            <small>Memuat...</small>
        </div> -->

        <!-- Detail -->
        <div v-else-if="isDetail && isChatsLoaded" class="h-100">

            <div class="detail-chat">
                <div v-if="dataChat.messages.length != 0" class="list-message" ref="list-message">

                    <small v-if="isLoadMore" class="d-flex justify-content-center align-items-center w-100">Memuat...</small>

                        <div v-for="(item, index) in dataChat.messages" :class="['message', item.senderId == user.id ? 'right' : 'left']" :key="index">
                            <div :class="['message-card', item.senderId == user.id ? 'right' : 'left']">
                                <p>{{item.message}}</p>
                                <small class="text-muted">{{item.created_at | time}}</small>
                            </div>
                        </div>
                </div>

                <div v-else class="list-message">
                    <small class="d-flex justify-content-center align-items-center w-100 h-100">Belum ada chat</small>
                </div>

                <b-form @submit="submitMessage" :class="['input-message', isMobile && role != 'superadmin' && role != 'admin' ? 'is-mobile' : '']">
                    <b-form-textarea
                        id="textarea-no-resize"
                        placeholder="Ketik disini.."
                        rows="2"
                        no-resize
                        max-rows="3"
                        v-model="textMessage"
                        type="text"
                        required
                        @keydown.enter.exact.prevent
                        @keyup.enter.exact="submitMessage"
                    ></b-form-textarea>
                    <b-button variant="primary" type="submit">Kirim</b-button>
                </b-form>
                
            </div>

        </div>

        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
            <small>Memuat...</small>
        </div>
        
    </div>
</template>

<script>
import moment from 'moment'

import { mapState } from 'vuex';

export default {
    props: {
        role: {
            type: String,
            default: ""
        },

        isMobile: {
            type: Boolean,
            default: false
        },

        newMessage: {
            type: Number,
            default: 0
        },

        reloadMessage: {
            type: Number,
            default: 0
        },
    },

    data() {
        return {
            RELOAD: "reload",
            LOADMORE: "loadmore",

            isDetail: false,
            isSearch: false,
            isSearchLoaded: false,
            isChatsLoaded: false,
            isLoadMore: false,

            textMessage: "",
            textSearch: "",
            
            user: JSON.parse(localStorage.getItem(('user'))),
            listChat: [],
            searchUser: [],
            dataChat: null,
                                        
            scrollHeight: 0,
            newScrollHeight: 0,

            pagination: {
                currentPage: 1,
                perPage: 1,
                totalRows: 1,
                lastPage: 1,
            },
        }
    },

    filters: {
        date: function (value) {
            if (!value) return '';
            return moment(value).locale('ID').fromNow();
        },
        time: function (value) {
            if(!value) return '';
            return moment(value).format('HH:mm')
        }
    },

    computed: {
        ...mapState({
            chatsState: (state) => state.Chats
        }),
    },

    mounted() {
        this.getAllChats()
    },

    watch: {
        newMessage: function () {
            this.getAllChats(this.RELOAD)
        },
        reloadMessage: function () {
            this.getChatsDetail(this.dataChat, this.RELOAD)
        },
    },

    methods: {
        toggleDetail(data) {
            this.isDetail = !this.isDetail
            this.isChatsLoaded = false

            if(this.isDetail) {
                this.dataChat = {
                    id: data.id,
                    photo: data.photo,
                    name: data.name,
                    messages: []
                }

                this.$emit('onChatingId', data.id)
                
                this.getChatsDetail(data)
            } else {
                this.getAllChats()    
                
                this.isChatsLoaded = false
                this.isSearch = false
                this.isLoadMore = false

                // this.listChat = []
                this.dataChat = null
                this.textMessage = ""
                this.pagination = {
                    currentPage: 1,
                    perPage: 1,
                    totalRows: 1,
                    lastPage: 1,
                }

                this.$emit('onChatingId', -1)
            }
        },

        toggleSearch() {
            this.isSearch = !this.isSearch
            this.isLoadMore = false

            this.dataChat = null
            this.textMessage = ""
            this.pagination = {
                currentPage: 1,
                perPage: 1,
                totalRows: 1,
                lastPage: 1,
            }

            this.textSearch = ""

            if(!this.isSearch) {
                this.getAllChats(this.RELOAD)
            }
        },

        async getAllChats(type) {

            if(type == this.RELOAD) {
                this.isChatsLoaded = true
            } else if(type == this.LOADMORE) {
                this.isLoadMore = true
            } else {
                this.isChatsLoaded = false
            }

            try {
                const page = type == this.LOADMORE ? this.pagination.currentPage + 1 : 1

                await this.$store.dispatch('Chats/allChats', page);

                if (!this.chatsState.status) {
                    console.error('failed fetch chats: ', this.chatsState.message);
                } else {
                    // console.log('success fetch chats: ', this.chatsState.chats);
                    if(type == this.LOADMORE) {
                        var newList = this.listChat
                        var newMessage = this.chatsState.chats

                        newMessage.map((item) => {
                            newList.push(item)
                        })

                        this.listChat = newList
                    } else {
                        this.listChat = this.chatsState.chats
                    }

                    this.pagination = this.chatsState.pagination
                    
                    this.isChatsLoaded = true

                    this.$nextTick(function () {

                        if(this.listChat.length != 0 && !this.isDetail) {

                            const listElm = this.$refs["list-chats"];
                            // console.log("ELEMEN ", listElm)

                            listElm.addEventListener('scroll', e => {

                                if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight && this.pagination.currentPage != this.pagination.lastPage && !this.isLoadMore && !this.isSearch) {

                                    this.getAllChats(this.LOADMORE)
                                    // this.isLoadMore = true
                                    // console.log('Memuat')

                                }

                            });
                        }

                    })
                }

                this.isLoadMore = false
                this.isChatsLoaded = true
            } catch (error) {
                console.error('failed fetch chats: ', error);
                this.isLoadMore = false
                this.isChatsLoaded = true
            }
        },

        async getChatsDetail(data, type) {

            if(this.type == this.RELOAD) {
                this.isChatsLoaded = true
            } else if(type == this.LOADMORE) {
                this.isLoadMore = true
            } else {
                this.isChatsLoaded = true
            }

            try {

                const params = {
                    id: data.id,
                    page: type == this.LOADMORE ? this.pagination.currentPage + 1 : 1
                }

                if(this.isSearch) {
                    await this.$store.dispatch('Chats/detailChatsUserId', params);
                } else {
                    await this.$store.dispatch('Chats/detailChats', params);
                }

                if (!this.chatsState.status) {
                    console.error('failed fetch chats: ', this.chatsState.message);
                } else {
                    // console.log('success fetch chats: ', this.chatsState.chats);
                    if(type == this.RELOAD) {

                        this.dataChat.messages = this.chatsState.detail.reverse()

                    } else if (type == this.LOADMORE) {
                        var newList = this.dataChat.messages
                        var newMessage = this.chatsState.detail

                        newMessage.map((item) => {
                            newList.unshift(item)
                        })

                        this.dataChat.messages = newList
                        // console.log("MESSAGES: ", this.dataChat.messages)
                    } else {

                        this.dataChat = {
                            id: data.id,
                            photo: data.photo,
                            name: data.name,
                            messages: this.chatsState.detail.reverse()
                        }

                    }

                    this.pagination = this.chatsState.pagination

                    // console.log("PAGINATION: ", this.pagination)

                    if(type != this.LOADMORE) {
                        setTimeout(() => {
                            $(".list-message").stop().animate({ scrollTop: $(".list-message")[0].scrollHeight}, 1)
                        }, 1)
                    }

                    this.$nextTick(function () {
                        if(this.dataChat.messages.length != 0) {
                            const listElm = this.$refs["list-message"];
                        
                            if (type == this.LOADMORE) {
                                this.newScrollHeight = listElm.scrollHeight - this.scrollHeight
                                // console.log('SCROLLLOAD: ', this.newScrollHeight, this.scrollHeight)
                                this.scrollHeight = listElm.scrollHeight
                                setTimeout(() => {
                                    $(".list-message").stop().animate({ scrollTop: (this.newScrollHeight - 30)}, 1)
                                }, 1)
                            } else {
                                this.scrollHeight = listElm.scrollHeight
                                // console.log('SCROLL: ', this.scrollHeight)
                            }
                            // console.log('SCROLL: ', scrol,scrollHeight)
                            // console.log("ELEMEN ", listElm)
                            listElm.addEventListener('scroll', e => {
                                // console.log(listElm.scrollTop)
                                // console.log(`SCROLL: ${listElm.scrollTop}, ${listElm.clientHeight}, ${listElm.scrollHeight}`)
                                if(listElm.scrollTop <= 1 && this.pagination.lastPage != this.pagination.currentPage && !this.isLoadMore) {
                                    // console.log("LOADMORE")
                                    this.getChatsDetail(this.dataChat, this.LOADMORE)
                                }
                            });
                        }
                    })
                    
                }

                if(type != this.LOADMORE && type != this.RELOAD) this.$emit('loadChats')

                this.isLoadMore = false
                this.isChatsLoaded = true
            } catch (error) {
                console.error('failed fetch chats: ', error);
                this.isChatsLoaded = true
            }
        },

        async submitMessage(event) {
            event.preventDefault()

            var params = {}

            if (this.isSearch) {
                params = {
                    targetId: this.dataChat.id,
                    message: this.textMessage,
                    fcm: localStorage.getItem('fcm_token')
                }
            } else {
                params = {
                    groupId: this.dataChat.id,
                    message: this.textMessage,
                    fcm: localStorage.getItem('fcm_token')
                }
            }

            // console.log('PARAMS: ', params)

            try {

                await this.$store.dispatch('Chats/sendChats', params);

                if (!this.chatsState.status) {
                    console.error('failed send messages: ', this.chatsState.message);
                } else {
                    // console.log('success send messages: ', this.chatsState.chats);
                    this.textMessage = ""
                    this.getChatsDetail(this.dataChat, this.RELOAD)
                }
                
                this.isChatsLoaded = true

            } catch (error) {
                console.error('failed send messages: ', error);
                this.isChatsLoaded = true
            }
        },

        async submitSearch(event) {
            event.preventDefault()
            this.isChatsLoaded = false

            if(this.textSearch.trim() == "") {

                return this.toggleSearch()
                
            }

            try {

                await this.$store.dispatch('Chats/searchUsers', this.textSearch);

                if (!this.chatsState.status) {
                    console.error('failed search user: ', this.chatsState.message);
                } else {
                    // console.log('success send messages: ', this.chatsState.chats);
                    this.listChat = this.chatsState.search
                }

                this.isChatsLoaded = true

            } catch (error) {
                this.isChatsLoaded = true
                console.error('failed search user: ', error);
            }
        },
    }
}
</script>