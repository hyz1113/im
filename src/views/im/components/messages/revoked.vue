<template>
    <div class="message-revoke">
        <template v-if="message.flow === 'in'">
            <label>{{ message.nick || message.from }}</label>
            <span>{{ $tt('{#撤回了一条消息#}') }}</span>
        </template>
        <template v-else>
            <span>{{ $tt('{#您撤回了一条消息#}') }}</span>
        </template>
        <a
            href="javascript:;"
            class="edit"
            v-if="message.flow === 'out' && isEdit"
            @click="onEditBtnClick">
            {{ $tt('{#重新编辑#}') }}
        </a>
    </div>
</template>

<script>
export default {
    name: 'MessageRevoked',
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            message: {},
        };
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler() {
                this.message = this.data;
            }
        },
    },
    methods: {
        onEditBtnClick() {
            this.$emit('edit', this.data);
        }
    }
}
</script>
<style lang="scss" scoped>
.message-revoke {
    display: flex;
    justify-content: center;
    color: #999999;
    width: 100%;
    font-size: 13px;
    padding-top: 12px;
    padding-bottom: 12px;
    .edit {
        padding: 0 5px;
        color: #006EFF;
    }
}
</style>
