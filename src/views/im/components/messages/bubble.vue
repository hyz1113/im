<template>
    <div
        :class="['message-bubble', message.flow === 'in' ? 'in' : 'reverse']"
        @contextmenu="onMessageItemContextmenu">
        <img
            class="avatar"
            :src="(message && message.avatar) || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
            alt=""
        >
        <main class="message-area">
            <div :class="['send-info', message.flow === 'in' ? 'in' : 'reverse']">
                <span v-if="message.flow !== 'in' && message.senderEmployeeId">
                    {{ message.senderEmployeeId }}
                </span>
                <span>{{ message.senderUserName || message.nick || message.from }}</span>
                <span>
                    {{ messageTime }}
                </span>
            </div>
            <div :class="`content content-${message.flow}`">
                <div v-if="false" class="message-reference-area">
                    <!-- <div class="message-reference-area-show">
                        <span></span>
                        <div class="face-box"></div>
                        <span></span>
                        <img class="message-img" src="" alt="">
                        <div class="message-audio"></div>
                    </div> -->
                </div>
                <slot />
            </div>
        </main>
        <label
            class="message-label fail"
            v-if="message.status === 'fail'"
            @click="onResendBtnClick(message)"
        >
            !
        </label>
        <label
            class="message-label"
            :class="[!message.isPeerRead && 'unRead']"
            v-if="message.conversationType === 'C2C' && message.flow !== 'in' && message.status === 'success'">
            <span v-if="!message.isPeerRead">
                {{ $tt('{#未读#}') }}
            </span>
        </label>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: "MessageBubble",
    props: {
        data: {
            type: Object,
            default: () => {
                return {};
            }
        },
        messagesList: {
            type: Object,
            default: () => ({}),
        },
        isH5: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            message: {},
        };
    },
    computed: {
        messageTime() {
            return moment(this.data.time * 1000).format('YYYY/MM/DD/ HH:mm:ss');
        },
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler(value) {
                // console.log('immediate: true deep:', value);
                this.message = value || {};
            },
        }
    },
    created() {
        // console.log('console.log()');
    },
    methods: {
        onResendBtnClick(message) {
            this.$emit('click');
        },
        onMessageItemContextmenu(event) {
            this.$emit('contextmenu', event, this.data);
        }
    }
}
</script>

<style lang="scss" scoped>
.reverse {
    flex-direction: row-reverse;
    justify-content: flex-start;
}
.avatar {
    width: 36px;
    height: 36px;
    border-radius: 5px;
}
.message-bubble {
    position: relative;
    display: flex;
    width: 100%;
}

.content {
    width: auto;
}
.message-area {
    margin-top: 10px;
    max-width: calc(100% - 105px);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 8px;

    .send-info {
        display: flex;
        width: 100%;
        font-size: 13px;
        margin-left: 4px;
        margin-right: 4px;
        margin-bottom: 4px;
        color: #000;
        span {
            padding: 0 4px;
        }
        &.reverse {
            flex-direction: row-reverse;
            justify-content: flex-start;
        }
    }

    .reference-content {
        padding: 10px;
        font-weight: 400;
        font-size: 14px;
        color: burlywood;
        letter-spacing: 0;
        word-wrap:break-word;
        word-break:break-all;
        animation: reference 800ms;
    }

    .content {
        padding: 10px;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        word-wrap: break-word;
        word-break: break-all;

        &-in {
            background: #ffffff;
            border-radius: 0px 4px 4px 4px;
        }

        &-out {
            background: #C9E7FF;
            border-radius: 4px 0px 4px 4px;
        }
    }
}
.message-reference-area{
  display: flex;
  padding-left: 4px;
  &-show {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 6px;
    span {
      height: 1.25rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 0.88rem;
      color: #BFC1C5;
      letter-spacing: 0;
    }
  }
}
.message-img {
  max-width: 100px;
  max-height: 100px;
}
.message-label {
  align-self: flex-end;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 12px;
  color: #B6B8BA;
  word-break: keep-all;
}
.fail {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
.unRead{
  color: #679CE1;
}
</style>
