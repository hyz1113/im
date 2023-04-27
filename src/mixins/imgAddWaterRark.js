/**
 * 文件转base64
 * @param  file 文件流
 * @param  callback 回调函数
 */
const fileByBase64 = function (file, callback){
    let reader = new FileReader();
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        // target.result 该属性表示目标对象的DataURL
        callback(e.target.result)
    };
};

/**
 * Base64转成canvas
 * @param  base64
 */
const imgToCanvas = async function (base64) {
    // 创建img元素
    const img = document.createElement('img')
    img.setAttribute('src', base64)
    await new Promise((resolve) => (img.onload = resolve))
    // 创建canvas DOM元素，并设置其宽高和图片一样
    const canvas = document.createElement('canvas')
    console.log(img.height)
    console.log(img.width)
    canvas.width = img.width
    canvas.height = img.height
    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
    canvas.getContext('2d').drawImage(img, 0, 0)
    return canvas
};

/**
 * canvas添加水印
 * @param  canvas 对象
 * @param text 水印文字
 */
const addWatermark = function (canvas, text) {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#afb2bd'
    ctx.textBaseline = 'middle'
    ctx.font = (ctx.canvas.width / 22) + 'px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.rotate((-15 * Math.PI) / 180);
    ctx.fillText(text, canvas.width / 2.7, canvas.height / 1.6)
    return canvas
};

/**
 * canvas转成img
 * @param {canvas对象} canvas
 */
const convasToImg = function (canvas, type) {
    // 新建Image对象，可以理解为DOM
    let image = new Image()
    // canvas.toDataURL 返回的是一串Base64编码的URL
    // 指定格式 PNG
    image.src = canvas.toDataURL(type)
    return image
};
/**
 * @param urlData  base64
 * @param fileName 文件名称
 * @returns {File}
 */
const base64ToFile = function (urlData, fileName) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bytes = atob(arr[1]); // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n);
    while (n--) {
        ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], fileName, { type: mime });
};

const beforeUpload = function (file, fillText) {
    return new Promise((resolve, reject) => {
        // 把文件转换为base64
        fileByBase64(file, async (base64) => { // 1.调用方法1： 把文件转换为base64字符串
            // 把文件转换为Canvas
            let tempCanvas = await imgToCanvas(base64) // 2. 调用方法2：把base64转换为Canvas
            // 把水印写入
            const canvas = addWatermark(tempCanvas, fillText) // 3.调用方法3： 写入水印到Canvas
            // canvas转成img
            const img = convasToImg(canvas, file.type) // 4. 调用方法4：把Canvas转换为image文件
            // 被canvas转换为文件
            let newFile = base64ToFile(img.src, file.name) // 5.调用方法5：被image转换为File文件
            resolve(newFile)
        })
    })
};

export default beforeUpload
