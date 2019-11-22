const Compressor = require('compressorjs');
const prefix = 'mc-image-uploader';

const imageUploaders = $(`.${prefix}`);

const noop = () => {}

class ImageUploader {
  constructor(dom, options = {}) {
    this.imageUploader = $(dom);

    this.pictureList = this.imageUploader.find(`.${prefix}-list`);
    this.placeholderDom = this.imageUploader.find(`.${prefix}-placeholder`);
    this.inputDom = $('<input type="file">');

    this.itemDoms = [];
    this.fileList = [];

    this.options = options;
    this.options.onChange = this.options.onChange || noop;
    this.options.onPreview = this.options.onPreview || noop;
    this.options.onRemove = this.options.onRemove || noop;
    this.options.beforeUpload = this.options.beforeUpload || noop;
    this.options.afterUpload = this.options.afterUpload || noop;
    this.options.uploadFileKey = this.options.uploadFileKey || 'file';
    this.options.maxLen = this.options.maxLen || 3;

    this.options.getExtraParams = this.options.getExtraParams;

    this.renderThumbnail();
    this.addListeners();
  }

  pickImage() {
    this.inputDom.attr({
      accept: 'image/*',
    });
    this.inputDom.removeAttr('capture')
    this.inputDom.trigger('click');
  }

  pickFile() {
    this.inputDom
      .removeAttr('accept')
      .removeAttr('capture');
    this.inputDom.trigger('click');
  }

  pickWithCamera() {
    this.inputDom.attr({
      accept: 'image/*',
      capture: 'camera'
    });
    this.inputDom.trigger('click');
  }

  readThumbnail(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        resolve(e.target.result);
      }
      reader.onerror = reject;
    })
  }

  renderThumbnail() {
    if (this.itemDoms.length === this.options.maxLen) {
      this.pictureList.html(this.itemDoms);
    } else {
      this.pictureList.html(
        this.itemDoms.concat($(`<span class="${prefix}-placeholder"></span>`))
      );
    }
  }

  handleInputChange(e) {
    let file = e.target.files[0];
    if (file) {
      this.readThumbnail(file)
        .then(data => {

          let upFileObject = {
            file,
            thumbnail: data,
            status: 'uploading',
          }
          const isImage = /^image\/.*/.test(file.type)

          this.fileList = this.fileList.concat(upFileObject);

          let thumbnailDom = $(`<span class="${prefix}-item">
              ${isImage?`<img src="${upFileObject.thumbnail}" alt="">`:`<span class=${prefix}-file-placeholder></span>`}
              <span class="${prefix}-percentage"></span>
              <span class="${prefix}-fail"></span>
              <i></i>
            </span>`);

          this.itemDoms = this.itemDoms.concat(thumbnailDom);
          this.renderThumbnail();
          this.uploadFile(upFileObject, thumbnailDom);
          e.target.value = '';
        })
    }
  }

  doUpload(upFileObject, thumbnailDom) {
    let data = new FormData();
    data.append(this.options.uploadFileKey, upFileObject.file, upFileObject.file.name)

    const getExtraParams = this.options.getExtraParams;
    if (typeof getExtraParams === 'function') {
      const extraParams = getExtraParams();
      for (const key in extraParams) {
        if (extraParams.hasOwnProperty(key)) {
          const element = extraParams[key];
          data.append(key, element);
        }
      }
    }

    const handleProgress = (e) => {
      if (e.lengthComputable) {
        thumbnailDom.find(`.${prefix}-percentage`).addClass('active');
        thumbnailDom.find(`.${prefix}-percentage`).html(Math.round(e.loaded / e.total * 100) + "%");
      }
    }

    const handleUploadSuccess = (e) => {
      upFileObject.status = 'done';
      thumbnailDom.find(`.${prefix}-percentage`).removeClass('active');
      this.options.onChange(this.fileList);
    }

    const handleUploadFail = (e) => {
      upFileObject.status = 'error';
      thumbnailDom.find(`.${prefix}-fail`).addClass('active');
      thumbnailDom.find(`.${prefix}-percentage`).removeClass('active');
      this.options.onChange(this.fileList);
    }

    $.ajax({
      type: 'POST',
      contentType: false,
      processData: false,
      url: this.options.action || '',
      data,
      xhr: () => {
　　　　 let xhr = $.ajaxSettings.xhr();
        upFileObject.xhr = xhr;
　　　　 if(xhr.upload) {
          xhr.onerror = handleUploadFail;
          xhr.upload.onprogress = handleProgress;
  　　　 }
        return xhr;
    　},
      success: (data, status, xhr) => {
        this.options.afterUpload();
        if (typeof this.options.judger !== 'function' || this.options.judger(data)) {
          upFileObject.responseData = data;
          handleUploadSuccess();
        } else {
          handleUploadFail();
        }
      },
      error: (xhr, errorType, error) => {
        this.options.afterUpload();
        handleUploadFail();
      },
    })
  }

  uploadFile(upFileObject, thumbnailDom) {

    if (typeof this.options.beforeUpload === 'function') {
      upFileObject = this.options.beforeUpload(upFileObject);
    }

    if (this.options.compressor) {
      new Compressor(upFileObject.file, {
        quality: 0.6,
        ...this.options.compressor,
        success: (result) => {
          upFileObject.file = result;
          this.doUpload(upFileObject, thumbnailDom);
        },
        error(err) {
          console.log(err.message);
        },
      });
    } else {
      this.doUpload(upFileObject, thumbnailDom);
    }
  }

  handleRemoveItem(e) {
    e.preventDefault();
    e.stopPropagation();
    let context = e.data.context;
    let index = $(this).parent(`.${prefix}-item`).index();
    context.removeItem(index);
  }

  removeItem(index) {
    let beforeRemove = this.options.beforeRemove;
    let file = this.fileList[index];
    let remove = () => {
      this.fileList[index].xhr.abort();
      this.itemDoms.splice(index, 1);
      this.fileList.splice(index, 1);
      this.options.onChange(this.fileList);
      this.options.onRemove(file, index, this.fileList)
      this.renderThumbnail();
    }
    if (typeof beforeRemove === 'function') {
      beforeRemove(file, index, this.fileList, remove)
    } else {
      remove()
    }
  }

  clearItem() {
    for (let index = 0; index < this.fileList.length; index++) {
      this.fileList[index].xhr.abort();
    }
    this.itemDoms = [];
    this.fileList = [];
    this.renderThumbnail();

  }

  handlePreview(e) {
    let context = e.data.context;
    let index = $(this).index();
    context.options.onPreview(context.fileList, index);
  }

  addListeners() {
    const options = this.options;
    if (typeof options.customTrigger === 'function') {
      this.imageUploader.on('click', `.${prefix}-placeholder`, options.customTrigger);
    } else {
      this.imageUploader.on('click', `.${prefix}-placeholder`, this.handlePick.bind(this));
    }
    this.inputDom.on('change', this.handleInputChange.bind(this));
    this.imageUploader.on('click', `.${prefix}-item`,{
      context: this
    }, this.handlePreview);

    this.imageUploader.on('click', `i`, {
      context: this
    }, this.handleRemoveItem);
  }
}

module.exports = ImageUploader;

// $.each(imageUploaders, (index, imageUploader) => {
//   new ImageUploader(imageUploader).init()
// })
