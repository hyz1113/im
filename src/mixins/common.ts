import {
    i18n,
} from '@/locales';
export default {
    install(app: any) {
        app.mixin({
            computed: {
                $t() {
                    // @ts-ignore
                    return i18n.global.t;
                },
            },
            methods: {
                // 拉取并获取新词条
                $tt(str: string) {
                    let langTxt = str.match(new RegExp('\\{#(.*)\\#\\}'));
                    return langTxt ? i18n.global.t(langTxt[1]) : '';
                },
            },
        });
    },
};
