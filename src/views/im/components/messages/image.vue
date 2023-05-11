<template>
    <div class="message-image">
        <van-image
            class="message-img"
            :style="imageStyle"
            :src="displayImageInfo.url"
        />
    </div>
</template>

<script>
export default {
    name: "MessageImage",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            show: false,
        };
    },
    computed: {
        displayImageInfo() {
            if (this.data.isServer) {
                return this.data.payload.imageInfoArray[2];
            } else {
                return this.data.payload.imageInfoArray[1];
            }
        },
        imageStyle() {
            return {
                width: `${this.displayImageInfo.width}px`,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.message-image {
    position: relative;
    .message-img {
        max-width: 275px;

        &.isWidth {
            width: 100%;
        }
        &.isHeight {
            height: 100%;
        }
    }
}
</style>
