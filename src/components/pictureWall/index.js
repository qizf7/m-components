const prefix = 'mc-picture-wall';

const pictureWalls = $(`.${prefix}`);

class PictureWall {
  constructor(pictureWall) {
    this.pictureWallDom = $(pictureWall);

    this.pictureList = this.pictureWallDom.find(`.${prefix}-list`);
    this.placeholderDom = this.pictureWallDom.find(`.${prefix}-placeholder`);
    this.inputDom = this.pictureWallDom.find(`.${prefix}-input`);

    this.fileList = [];

    this.renderThumbnail();
  }

  handleToggle(e) {
    $(this.select).toggleClass('show');
    return false;
  }

  handlePick(e) {
    this.inputDom.trigger('click');
  }

  handleInputChange(e) {
    let fileList = e.target.files;
    this.fileList = this.fileList.concat(...fileList);
    e.target.value = '';
    this.renderThumbnail();
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
    Promise.all(
      this.fileList.map((file, index) => {
        return this.readThumbnail(file)
      })
    )
      .then(dataList => {
        this.thumbnailList = dataList;
        let html = dataList.map((data, index) => {
          return `
            <span class="mc-picture-wall-item">
              <i data-index=${index}></i>
              <img src="${data}" alt="">
            </span>
          `
        }).join('');
        html += '<span class="mc-picture-wall-placeholder"></span>'
        this.pictureList.html(html)
      })
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
