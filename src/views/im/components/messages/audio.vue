<template>
    <div class="message-audio" :class="[data.flow === 'out' && 'reserve']" @click="onPlayBtnClick">
        <label v-if="audioInfo">{{ audioInfo.second }}s</label>
        <i class="icon icon-voice" :class="[data.flow === 'out' && 'icon-reserve']"></i>
        <!--        <audio v-if="audioInfo" ref="audio" :src="audioInfo.url" controls></audio>
                <div v-if="show" class="mask" @click.self="onPlayBtnClick"></div>-->
    </div>
</template>

<script>
export default {
    name: "MessageAudio",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            show: false,
            audioInfo: null,
        };
    },
    created() {
        this.audioInfo = this.data ? this.data.payload || null : null;
    },
    methods: {
        onPlayBtnClick() {
            this.$emit('play', this.audioInfo.url);
        },
        onMaskClose() {
            this.show = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.message-audio {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 13px;
    .icon {
        margin: 0 4px;
        &.icon-voice {
            width: 20px;
            height: 20px;
            background: red;
            background-size: 100%;
        }
    }
    audio {
        width: 0;
        height: 0;
    }
}
.reserve {
    flex-direction: row-reverse;
}
.mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 9999;
    background: RGBA(0, 0, 0, 1);
}
</style>
