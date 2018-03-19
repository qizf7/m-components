const prefix = 'mc-image-uploader';

const imageUploaders = $(`.${prefix}`);

const FILE_STATUS = [
  'uploading',
  'done',
  'error',
]

class ImageUploader {
  constructor(dom, options = {}) {
    this.options = options;
    this.imageUploader = $(dom);

    this.pictureList = this.imageUploader.find(`.${prefix}-list`);
    this.placeholderDom = this.imageUploader.find(`.${prefix}-placeholder`);
    this.inputDom = this.imageUploader.find(`.${prefix}-input`);

    this.itemDoms = [];
    this.fileList = [];

    this.renderThumbnail();

    this.addListeners();

    this.options.onChange = this.options.onChange || (() => {});
    this.options.urlField = this.options.urlField || 'url';
  }

  handlePick(e) {
    this.inputDom.trigger('click');
  }

  readThumbnail(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        resolve(e.target.result)
      }
      reader.onerror = reject
    })
  }

  renderThumbnail() {
    this.pictureList.html(
      this.itemDoms.concat($(`<span class="${prefix}-placeholder"></span>`))
    );
  }

  handleInputChange(e) {
    let file = e.target.files[0];
    if (file) {
      this.readThumbnail(file)
        .then(data => {

          let upFileObject = {
            file,
            thumbnail: data,
            status: 'uploading'
          }

          let index = this.fileList.length - 1;

          this.fileList = this.fileList.concat(upFileObject);

          let thumbnailDom = $(`
            <span class="${prefix}-item">
              <img src="${upFileObject.thumbnail}" alt="">
              <span class="${prefix}-percentage"></span>
              <span class="${prefix}-fail"></span>
              <i></i>
            </span>
          `);

          // todo
          thumbnailDom.on('click', 'img',() => {
            this.options.onPreview(this.fileList, index);
          })

          this.itemDoms = this.itemDoms.concat(thumbnailDom);
          this.renderThumbnail();

          this.uploadFile(upFileObject, thumbnailDom);
          e.target.value = '';
        })
    }
  }

  uploadFile(upFileObject, thumbnailDom) {
    let data = new FormData();
    data.append("file", upFileObject.file)

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
　　　　 var xhr = $.ajaxSettings.xhr();
        upFileObject.xhr = xhr;
　　　　 if(xhr.upload) {
          xhr.onerror = handleUploadFail;
          xhr.upload.onprogress = handleProgress;
　　　　　  return xhr;
  　　　 }
    　},
      success: (data, status, xhr) => {
        if (typeof this.options.judger !== 'function' || this.options.judger(data)) {
          upFileObject.url = data[this.options.urlField]
          handleUploadSuccess();
        } else {
          handleUploadFail();
        }
      },
      error: (xhr, errorType, error) => {
        handleUploadFail();
      }
    })
  }

  removeItem(e) {
    let context = e.data.context;
    let index = $(this).parent(`.${prefix}-item`).index();
    context.fileList[index].xhr.abort();
    context.itemDoms.splice(index, 1);
    context.fileList.splice(index, 1);
    context.options.onChange(context.fileList);
    context.renderThumbnail();
  }

  addListeners() {
    this.imageUploader.on('click', `.${prefix}-placeholder`, this.handlePick.bind(this));
    this.imageUploader.on('change', `.${prefix}-input`, this.handleInputChange.bind(this));

    this.imageUploader.on('click', `i`, {
      context: this
    }, this.removeItem);
  }
}

module.exports = ImageUploader;

// $.each(imageUploaders, (index, imageUploader) => {
//   new ImageUploader(imageUploader).init()
// })
