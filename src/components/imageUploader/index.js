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

    this.uploading = false;

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
    this.itemDoms = this.fileList.map((upFileObject, index) => {
      let itemHtml = `
        <span class="${prefix}-item" data-index=${index}>
          <img src="${upFileObject.thumbnail}" alt="">
          <span class="${prefix}-percentage ${upFileObject.status === 'uploading' ? 'active' : ''}"></span>
          <span class="${prefix}-fail ${upFileObject.status === 'error' ? 'active' : ''}"></span>
          <i data-index=${index}></i>
        </span>
      `;

      let containerDom = $(itemHtml);
      // todo
      containerDom.on('click', 'img',() => {
        this.options.onPreview(this.fileList, index);
      })

      return {
        containerDom,
        percentageDom:  containerDom.find(`.${prefix}-percentage`),
        failDom: containerDom.find(`.${prefix}-fail`)
      };
    });
    this.itemDoms.push({
      containerDom: $(`<span class="${prefix}-placeholder"></span>`)
    });
    this.pictureList.html(this.itemDoms.map(item => item.containerDom));
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
          this.fileList = this.fileList.concat(upFileObject);
          e.target.value = '';
          this.renderThumbnail();
          this.uploadFile(upFileObject, this.fileList.length - 1);
        })
    }
  }

  uploadFile(upFileObject, index) {
    let data = new FormData();
    data.append("file", upFileObject.file)

    const handleProgress = (e) => {
      if (e.lengthComputable) {
        this.itemDoms[index].percentageDom.html(Math.round(e.loaded / e.total * 100) + "%");
      }
    }

    const handleUploadSuccess = (e) => {
      upFileObject.status = 'done';
      this.itemDoms[index].percentageDom.removeClass('active');
      this.options.onChange(this.fileList);
    }

    const handleUploadFail = (e) => {
      upFileObject.status = 'error';
      this.itemDoms[index].failDom.addClass('active');
      this.itemDoms[index].percentageDom.removeClass('active');
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
    for (let i = 0; i < context.fileList.length; i++) {
      if (context.fileList[i].status === 'uploading') {
        return false
      }
    }
    let index = $(this).attr('data-index');
    let upFileObject = context.fileList.splice(index, 1);
    upFileObject[0].xhr.abort();
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
