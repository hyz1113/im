<template>
    <div class="message-text">
        <div v-for="(item, index) in message.text" :key="index">
            <div class="text-box" v-if="item.name === 'text'" v-html="item.text"></div>
            <!--<span class="text-box" v-if="item.name === 'text'">{{ item.text }}</span> -->
            <img class="text-img" v-else-if="item.name === 'img'" :src="item.src" />
        </div>
    </div>
</template>
<script>
import { decodeText } from '../../../IMUtils/decodeText';

export default {
    name: 'MessageText',
    props: {
        widthMark: {
            type: Boolean,
            default: false
        },
        markWord: {
            type: String,
            default: '',
        },
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            message: {},
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(value) {
                this.formatTextMessageShowContext(value);
            }
        }
    },
    methods: {
        formatTextMessageShowContext(item) {
            if (this.data) {
                this.message = {
                    text: decodeText(item.payload, this.widthMark, this.markWord),
                };
            } else {
                this.message = {};
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.message-text {
    height: auto;
    line-height: 20px;
    &,
    &div {
        display: inline-block;
        vertical-align: baseline;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
    }
    /deep/ .text-box {
        b {
            color: red;
        }
    }
}
.text-img {
  width: 20px;
  height: 20px;
}
</style>
