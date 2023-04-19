<template>
    <div class="message-tip">
        {{ data && data.text }}
    </div>
</template>

<script>
export default {
    name: 'MessageTip',
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            message: {},
        }
    },
    watch: {}
}
</script>
