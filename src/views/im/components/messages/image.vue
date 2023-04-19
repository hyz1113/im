<template>
    <div class="message-image">
        <el-image
            class="message-img"
            fit="cover"
            :style="imageStyle"
            :src="displayImageInfo.imageUrl"
            :preview-src-list="srcList">
        </el-image>
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
            // console.log('this.data.payload.imageInfoArray', this.data.payload.imageInfoArray);
            if (this.data.isServer) {
                return this.data.payload.imageInfoArray[2];
            } else {
                return this.data.payload.imageInfoArray[1];
            }
        },
        srcList() {
            const previewImageInfo = this.data.payload.imageInfoArray[0];
            return [
                previewImageInfo.imageUrl
            ];
        },
        imageStyle() {
            return {
                width: `${this.displayImageInfo.width}px`,
                height: `${this.displayImageInfo.height}px`
            }
        },
    },
    watch: {
        data: {
            immediate: true,
            handler() {
                if (Array.isArray(this.data)) {

                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.message-image {
    position: relative;
    .message-img {
        max-width: 275px;
        max-height: 300px;
        &.isWidth {
            width: 100%;
        }
        &.isHeight {
            height: 100%;
        }
    }
}
</style>
