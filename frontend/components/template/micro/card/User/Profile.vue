<template>
    <div class="card card-profile">

        <div :class="`card-body ${ bodyClass }`">

            <div class="text-center">

                <div v-if="actionUrl" class="box-action">
                    <nuxt-link
                        :to="actionUrl">

                        <i class="ri-edit-2-fill"></i>

                    </nuxt-link>
                </div>

                <b-avatar
                    size="80px"
                    class="profile-img"
                    :src="photo"
                    :text="photo == '' || photo == null ? name[0] : ''">
                </b-avatar>

                <h5 class="profile-name">{{ name }}</h5>
                <p v-if="role" class="profile-role">{{ role }}</p>

                <div :class="`box-contact ${ isPreview ? 'isPreview' : '' }`">

                    <span v-if="isPreview" @click="$emit('onDetailClick')" class="custom-tooltip pointer">
                        <i class="ri-profile-fill"></i>
                        <div class="content-tooltip">
                            <i class="ri-profile-fill"></i>
                            <span>Profil</span>
                        </div>
                    </span>

                    <a v-if="!!city" href="#" class="custom-tooltip">
                        <i class="ri-map-pin-2-fill"></i>
                        <div class="content-tooltip">
                            <i class="ri-map-pin-2-fill"></i>
                            <span>{{ city?.name }}</span>
                        </div>
                    </a>

                    <a v-if="!!email" :href="`mailto:${email}`" class="custom-tooltip">
                        <i class="ri-mail-fill"></i>
                        <div class="content-tooltip">
                            <i class="ri-mail-fill"></i>
                            <span>{{ email }}</span>
                        </div>
                    </a>

                    <a v-if="!!phone" :href="`tel:${phone}`" class="custom-tooltip">
                      <i class="ri-phone-fill"></i>
                      <div class="content-tooltip">
                        <i class="ri-phone-fill"></i>
                        <span>{{ phone }}</span>
                      </div>
                    </a>

                    <a v-if="!!linkedIn" :href="linkedIn" target="_blank" class="custom-tooltip">
                      <i class="ri-linkedin-fill"></i>
                      <div class="content-tooltip">
                        <i class="ri-linkedin-fill"></i>
                        <span>{{ linkedIn }}</span>
                      </div>
                    </a>

                    <a v-if="!!github" :href="github" target="_blank" class="custom-tooltip">
                        <i class="ri-github-fill"></i>
                        <div class="content-tooltip">
                            <i class="ri-github-fill"></i>
                            <span>{{ github }}</span>
                        </div>
                    </a>

                </div>

            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        bodyClass: {
            type: String,
            default: ""
        },
        isPreview: {
            type: Boolean,
            default: false
        },
        actionUrl: {
            type: String,
            default: "",
        },
        detailUrl: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            default: "",
        },
        photo: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        city: {
            type: Object,
            default: () => {},
        },
        email: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        linkedIn: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        user: {
          type: Object,
          default: null,
        }
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            authState: (state) => state.Auth,
        })
    },
    data() {
      return {
        userKind: localStorage.getItem('user_kind'),
        isStudent: this.role?.toLowerCase() === 'student',
        settings: null,
      }
    },
    created() {
      this.settings = this.sassState.settings
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>
.card-profile ::v-deep {

    i {
        font-size: 16px;
    }

    .profile-img {
        padding: 4px;
        margin-bottom: 12px;

        .b-avatar-img {
            img {
                width: 100%;
                height: 100%;
            }
        }

    }

    .profile-name {
        font-family: var(--bs-font-heading);
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: var(--bs-dark);
    }

    .profile-role {
        font-family: var(--bs-font-paragraph);
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
        color: rgba(0, 0, 0, 0.5);
    }

    .box-action {
        display: flex;
        justify-content: flex-end;
        margin-top: -4px;
        margin-bottom: 12px;

        i {
            color: #03053D;
        }

    }

    .box-contact {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin-top: 32px;

        &.isPreview { margin-top: 12px; }

        i {
            color: rgba(3, 5, 61, 0.5);
        }

        .custom-tooltip {
            position: relative;
            display: flex;
            padding: 6px;
            transition: 0.5s ease-in-out;

            &:hover {
                border-radius: 6px;
                background-color: #F5F6F6;
            }

            .content-tooltip {
                visibility: hidden;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                padding: 12px;
                gap: 8px;

                width: 240px;
                min-height: 40px;

                background: #F5F6F7;
                border-radius: 6px;

                /* Position the tooltip text */
                position: absolute;
                z-index: 1;
                top: 150%;
                margin-left: -120px;

                /* Fade in tooltip */
                opacity: 0;
                transition: 0.5s ease-in-out;

                span {
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 15px;
                    color: #000000;
                }

            }

            &:hover {
                .content-tooltip {
                    visibility: visible;
                    opacity: 1;
                }
            }

        }
    }
}

/* Alert */
</style>