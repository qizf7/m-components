# m-components

## 运行方式
- npm i
- npm run server

## 开发
- npm i
- npm run dev

## 使用方法
1. 引入zepto或jquery
2. 引入lib目录下 m-components.css 和 m-components.js
3. 使用方法参考public目录

## 按钮
![按钮](https://github.com/QizhongFang/m-components/blob/master/docs/images/button.png?raw=true)

```html
  <section>
      <h2>按钮</h2>
      <button class="mc-button">确认</button>
      <br>
      <button class="mc-button" disabled>确认</button>
      <br>
      <button class="mc-button" type="danger">确认</button>
      <br>
      <button class="mc-button" type="danger" disabled>确认</button>
  </section>
```


## Form
![表单](https://github.com/QizhongFang/m-components/blob/master/docs/images/form.png?raw=true)

```html
  <section>
    <h2>表单</h2>
    <form>
      <div class="mc-form-item-wrapper">
        <div class="mc-form-item">
          <label for="account">文本</label> <input type="text" placeholder="请输入">
        </div>
        <div class="mc-form-item">
          <label for="password">密码</label> <input type="password" placeholder="请输入">
        </div>
        <div class="mc-form-item">
          <textarea  placeholder="多行文本"></textarea>
        </div>
        <div class="mc-form-item">
            <label>选择</label>
            <select>
              <option value="1">选项1</option>
              <option value="2">选项2</option>
            </select>
        </div>
        <div class="mc-form-message" type="error">
          <span>错误</span>
        </div>
      </div>
    </form>
  </section>
```

## Select
![选择](https://github.com/QizhongFang/m-components/blob/master/docs/images/select.png?raw=true)
![选择](https://github.com/QizhongFang/m-components/blob/master/docs/images/select-rect.png?raw=true)

```html
  <section>
    <h2>select</h2>
    <div class="mc-select">
      <div class="mc-select-text-container">
        <input class="mc-select-text" readonly type="text" placeholder="请选择">
        <input class="mc-select-value" readonly type="hidden">
        <span class="mc-select-icon"></span>
      </div>
      <ul class="mc-select-option-container">
        <li class="mc-select-option" data-value="1">北京</li>
        <li class="mc-select-option" data-value="2">上海</li>
        <li class="mc-select-option" data-value="3">杭州</li>
      </ul>
    </div>

    <div class="mc-select" type="rect">
      <div class="mc-select-text-container">
        <input class="mc-select-text" readonly type="text" placeholder="请选择">
        <input class="mc-select-value" readonly type="hidden">
        <span class="mc-select-icon"></span>
      </div>
      <ul class="mc-select-option-container">
        <li class="mc-select-option" data-value="1">北京</li>
        <li class="mc-select-option" data-value="2">上海</li>
        <li class="mc-select-option" data-value="3">杭州</li>
      </ul>
    </div>
  </section>
```

## Checkbox
![复选](https://github.com/QizhongFang/m-components/blob/master/docs/images/checkbox.png?raw=true)

```html
<section>
    <h2>复选</h2>
    <div class="mc-form-item">
      <div class="mc-checkbox">
        <label class="mc-checkbox-item">
          <input type="checkbox" name="a"></input>
          <span class="mc-checkbox-icon"></span>
          选项1
        </label>
        <label class="mc-checkbox-item checked">
          <input type="checkbox" name="a"></input>
          <span class="mc-checkbox-icon"></span>
          选项2
        </label>
        <label class="mc-checkbox-item">
          <input type="checkbox" name="a"></input>
          <span class="mc-checkbox-icon"></span>
          选项3
        </label>
      </div>
    </div>
  </section>
```

## Radio
![单选](https://github.com/QizhongFang/m-components/blob/master/docs/images/radio.png?raw=true)

```html
  <section>
    <h2>单选</h2>
    <div class="mc-form-item" type="plus">
      <div class="mc-radio">
        <label class="mc-radio-item">
          <input type="radio" name="a"></input>
          <span class="mc-radio-icon"></span>
          <span>选项1</span>
        </label>
        <label class="mc-radio-item checked">
          <input type="radio" name="a"></input>
          <span class="mc-radio-icon"></span>
          <span>选项2</span>
        </label>
        <label class="mc-radio-item">
          <input type="radio" name="a"></input>
          <span class="mc-radio-icon"></span>
          <span>选项3</span>
        </label>
      </div>
    </div>
  </section>
```

## Tab
![Tab](https://github.com/QizhongFang/m-components/blob/master/docs/images/tab.png?raw=true)

```html
  <section>
    <h2>Tab</h2>
    <div class="mc-tab-group">
      <div class="mc-tab-items">
          <span class="mc-tab-item active">tab1</span>
          <span class="mc-tab-item">tab2</span>
          <span class="mc-tab-item">tab3</span>
      </div>
      <div class="mc-tab-panels">
          <div class="mc-tab-panel active">tab1 content</div>
          <div class="mc-tab-panel">tab2 content</div>
          <div class="mc-tab-panel">tab3 content</div>
      </div>
    </div>

    <div class="mc-tab-group" size="small">
        <div class="mc-tab-items">
            <span class="mc-tab-item active">tab1</span>
            <span class="mc-tab-item">tab2</span>
        </div>
        <div class="mc-tab-panels">
            <div class="mc-tab-panel active">tab1 content</div>
            <div class="mc-tab-panel">tab2 content</div>
        </div>
      </div>
  </section>
```


## 日历
![Tab](https://github.com/QizhongFang/m-components/blob/master/docs/images/calendar.png?raw=true)

```html
  <section>
    <h2>日期选择</h2>
    <div class="mc-calendar">
      <div class="mc-calendar-text-container">
        <input class="mc-calendar-text" type="text" readonly placeholder="请选择"></input>
        <span class="mc-calendar-icon"></span>
      </div>
    </div>
  </section>
```
