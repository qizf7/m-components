const prefix = 'mc-picture-wall';

const pictureWalls = $(`.${prefix}`);

class PictureWall {
  constructor(pictureWall) {
    this.pictureWallDom = $(pictureWall);

    this.pictureList = this.pictureWallDom.find(`.${prefix}-list`);
    this.placeholderDom = this.pictureWallDom.find(`.${prefix}-placeholder`);
    this.inputDom = this.pictureWallDom.find(`.${prefix}-input`);

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
      this.fileList = this.fileList.concat(file);
      this.uploadingIndex = this.fileList.length - 1;
      e.target.value = '';
      this.renderThumbnail()
        .then(() => {
          this.uploadFile(file);
        });
    }
  }

  handleProgress(e) {
    if (e.lengthComputable) {
      console.log(e.loaded, this.uploadingIndex)
      console.log(this.itemDoms)
      console.log(this.itemDoms[this.uploadingIndex].find(`.${prefix}-percentage`)[0])
      this.itemDoms[this.uploadingIndex].find(`.${prefix}-percentage`).html(Math.round(e.loaded / e.total * 100) + "%");
    }
  }

  handleUploadStart(e) {
    this.uploading = true;
    this.itemDoms[this.uploadingIndex].find(`.${prefix}-percentage`).addClass('active');
    console.log('start')
  }

  handleUploadComplete(e) {
    this.uploading = false;
    this.itemDoms[this.uploadingIndex].find(`.${prefix}-percentage`).removeClass('active');
    alert("上传成功！");
  }

  handleUploadFail(e) {
    this.uploading = false;
    this.itemDoms[this.uploadingIndex].find(`.${prefix}-fail`).addClass('active');
    this.itemDoms[this.uploadingIndex].find(`.${prefix}-percentage`).removeClass('active');
    alert("上传失败！");
  }

  uploadFile(file) {
    let data = new FormData();
    data.append("file", file)
    $.ajax({
      type: 'POST',
      contentType: false,
      processData: false,
      url: 'http://localhost:3080/upload',
      data,
      xhr: () => {
　　　　 var xhr = $.ajaxSettings.xhr();
　　　　 if(xhr.upload) {
          xhr.onload = this.handleUploadComplete.bind(this);
          xhr.onerror =  this.handleUploadFail.bind(this);
          xhr.upload.onprogress = this.handleProgress.bind(this);
          xhr.upload.onloadstart = this.handleUploadStart.bind(this);
　　　　　 return xhr;
  　　　 }
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
    return Promise.all(
      this.fileList.map((file, index) => {
        return this.readThumbnail(file)
      })
    )
      .then(dataList => {
        // @todo 缓存节点 上传时使用缓存节点显示百分比
        let itemDoms = [];
        let html = dataList.map((data, index) => {
          let itemHtml = `
            <span class="mc-picture-wall-item" data-index=${index}>
              <img src="${data}" alt="">
              <span class="mc-picture-wall-percentage"></span>
              <span class="mc-picture-wall-fail"></span>
              <i data-index=${index}></i>
            </span>
          `
          itemDoms.push($(itemHtml));
          return itemHtml;
        }).join('');
        this.itemDoms = itemDoms;
        html += '<span class="mc-picture-wall-placeholder"></span>'
        this.pictureList.html(html)
      })

    // let html = this.fileList.map((file, index) => {
    //   return `
    //     <span class="mc-picture-wall-item">
    //       <i data-index=${index}></i>
    //       <img src="${URL.createObjectURL(file)}" alt="">
    //     </span>
    //   `
    // }).join('');
    // html += '<span class="mc-picture-wall-placeholder"></span>'
    // this.pictureList.html(html)

  }

  removeItem(e) {
    let context = e.data.context;
    let index = $(this).index();
    context.fileList.splice(index, 1);
    context.renderThumbnail();
  }

  addListeners() {
    this.pictureWallDom.on('click', `.${prefix}-placeholder`, this.handlePick.bind(this));
    this.pictureWallDom.on('change', `.${prefix}-input`, this.handleInputChange.bind(this));

    this.pictureWallDom.on('click', `i`, {
      context: this
    }, this.removeItem);
  }

  init() {
    this.addListeners()
  }
}

$.each(pictureWalls, (index, pictureWall) => {
  new PictureWall(pictureWall).init()
})
