// import { emojiMap, emojiUrl } from './emojiMap';

export function htmlEncodeByRegExp(str, widthMark, markWord){
    let temp = "";
    if(str.length === 0) return "";
    temp = str.replace(/&/g, "&amp;");
    temp = temp.replace(/</g, "&lt;");
    temp = temp.replace(/>/g, "&gt;");
    // temp = temp.replace(/\s/g, "&nbsp;");
    temp = temp.replace(/\'/g, "&#39;");
    temp = temp.replace(/\"/g, "&quot;");
    if (widthMark && markWord && markWord.trim()) {
        const regExp = new RegExp(markWord, "g");
        temp = temp.replace(regExp, `<b>${markWord}</b>`);
    }
    temp = temp.replace(/\n/g, '<br />')
    return temp;
}
/** 传入messageBody（群系统消息SystemMessage，群提示消息GroupTip除外）
 * payload = {
 *  msgType: 'TIMTextElem',
 *  msgContent: {
 *    text: 'AAA[龇牙]AAA[龇牙]AAA[龇牙AAA]'
 *  }
 *}
 **/
export function decodeText(payload, widthMark, markWord) {
    const renderDom = [];
    // 文本消息
    let temp = htmlEncodeByRegExp((payload.text || ''), widthMark, markWord);
    renderDom.push({
        name: 'text',
        text: temp,
    });
    // let left = -1;
    // let right = -1;
    // while (temp !== '') {
    //     left = temp.indexOf('[');
    //     right = temp.indexOf(']');
    //     switch (left) {
    //         case 0:
    //             if (right === -1) {
    //                 renderDom.push({
    //                     name: 'text',
    //                     text: temp,
    //                 });
    //                 temp = '';
    //             } else {
    //                 const emojiKey = temp.slice(0, right + 1);
    //                 if (emojiMap[emojiKey]) {
    //                     renderDom.push({
    //                         name: 'img',
    //                         src: emojiUrl + emojiMap[emojiKey],
    //                     });
    //                     temp = temp.substring(right + 1);
    //                 } else {
    //                     renderDom.push({
    //                         name: 'text',
    //                         text: '[',
    //                     });
    //                     temp = temp.slice(1);
    //                 }
    //             }
    //             break;
    //         case -1:
    //             renderDom.push({
    //                 name: 'text',
    //                 text: temp,
    //             });
    //             temp = '';
    //             break;
    //         default:
    //             renderDom.push({
    //                 name: 'text',
    //                 text: temp.slice(0, left),
    //             });
    //             temp = temp.substring(left);
    //             break;
    //     }
    // }
    return renderDom;
}
