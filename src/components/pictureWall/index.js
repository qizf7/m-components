const prefix = 'mc-image-uploader';

const imageUploaders = $(`.${prefix}`);

const FILE_STATUS = [
  'uploading',
  'done',
  'error',
]

class ImageUploader {
  constructor(imageUploader) {
    this.imageUploader = $(imageUploader);

    this.pictureList = this.imageUploader.find(`.${prefix}-list`);
    this.placeholderDom = this.imageUploader.find(`.${prefix}-placeholder`);
    this.inputDom = this.imageUploader.find(`.${prefix}-input`);

    this.itemDoms = [];
    this.fileList = [];

    this.uploadingIndex = '';
    this.uploading = false;

    this.renderThumbnail();
  }

  handlePick(e) {
    if (!this.uploading) {
      this.inputDom.trigger('click');
    }
  }

  handleInputChange(e) {
    let file = e.target.files[0];
    if (file) {
      this.readThumbnail(file)
        .then(data => {
          file.thumbnail = data;
          file.status = 'uploading';
          this.uploading = true;
          this.fileList = this.fileList.concat(file);
          this.uploadingIndex = this.fileList.length - 1;
          e.target.value = '';
          this.renderThumbnail();
          this.uploadFile(file, this.fileList.length - 1);
        })
    }
  }




  uploadFile(file, index) {
    let data = new FormData();
    data.append("file", file)

    const handleProgress = (e) => {
      if (e.lengthComputable) {
        this.itemDoms[index].find(`.${prefix}-percentage`).html(Math.round(e.loaded / e.total * 100) + "%");
      }
    }

    const handleUploadSuccess = (e) => {
      this.uploading = false;
      this.itemDoms[index].find(`.${prefix}-percentage`).removeClass('active');
    }

    const handleUploadFail = (e) => {
      this.uploading = false;
      this.itemDoms[index].find(`.${prefix}-fail`).addClass('active');
      this.itemDoms[index].find(`.${prefix}-percentage`).removeClass('active');
    }

    $.ajax({
      type: 'POST',
      contentType: false,
      processData: false,
      url: 'http://localhost:3080/upload',
      data,
      xhr: () => {
　　　　 var xhr = $.ajaxSettings.xhr();
　　　　 if(xhr.upload) {
          xhr.onerror = handleUploadFail;
          xhr.upload.onprogress = handleProgress;
　　　　　 return xhr;
  　　　 }
    　},
      success: (data, status, xhr) => {
        this.fileList[index].status = 'done';
        handleUploadSuccess();
        console.log(data)
      },
      error: (xhr, errorType, error) => {
        this.fileList[index].status = 'error';
        handleUploadFail();
        console.log('error')
        console.log(errorType)
        console.log(error)
      }
    })
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
    // return Promise.all(
    //   this.fileList.map((file, index) => {
    //     return this.readThumbnail(file)
    //   })
    // )
    //   .then(dataList => {
    //     // @todo 缓存节点 上传时使用缓存节点显示百分比
    //     this.itemDoms = dataList.map((data, index) => {
    //       let itemHtml = `
    //         <span class="${prefix}-item" data-index=${index}>
    //           <img src="${data}" alt="">
    //           <span class="${prefix}-percentage"></span>
    //           <span class="${prefix}-fail"></span>
    //           <i data-index=${index}></i>
    //         </span>
    //       `
    //       return $(itemHtml);
    //     });
    //     this.itemDoms.push($(`<span class="${prefix}-placeholder"></span>`));
    //     this.pictureList.html(this.itemDoms)
    //   })

      this.itemDoms = this.fileList.map((file, index) => {
        let itemHtml = `
          <span class="${prefix}-item" data-index=${index}>
            <img src="${file.thumbnail}" alt="">
            <span class="${prefix}-percentage ${file.status === 'uploading' ? 'active' : ''}"></span>
            <span class="${prefix}-fail ${file.status === 'error' ? 'active' : ''}"></span>
            <i data-index=${index}></i>
          </span>
        `
        return $(itemHtml);
      });
      this.itemDoms.push($(`<span class="${prefix}-placeholder"></span>`));
      this.pictureList.html(this.itemDoms)


    // let html = this.fileList.map((file, index) => {
    //   return `
    //     <span class="${prefix}-item">
    //       <i data-index=${index}></i>
    //       <img src="${URL.createObjectURL(file)}" alt="">
    //     </span>
    //   `
    // }).join('');
    // html += '<span class="${prefix}-placeholder"></span>'
    // this.pictureList.html(html)

  }

  removeItem(e) {
    let context = e.data.context;
    let index = $(this).attr('data-index');
    context.fileList.splice(index, 1);
    context.renderThumbnail();
  }

  addListeners() {
    this.imageUploader.on('click', `.${prefix}-placeholder`, this.handlePick.bind(this));
    this.imageUploader.on('change', `.${prefix}-input`, this.handleInputChange.bind(this));

    this.imageUploader.on('click', `i`, {
      context: this
    }, this.removeItem);
  }

  init() {
    this.addListeners()
  }
}

$.each(imageUploaders, (index, imageUploader) => {
  new ImageUploader(imageUploader).init()
})
