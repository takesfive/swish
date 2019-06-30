# Swish

Simple slider without dependencies :stuck_out_tongue_winking_eye:

- swipe
- drag
- responsive
- infinity

---

## Work example

https://takesfive.github.io/swish/

---

## Quick start :sunglasses:

#### Step 1

Add this code in your html

```
<div class="swish">
  <div class="swish-inner">
    <ul class="swish-list">
      <li class="swish-list__item">
        <div style="height: 300px; width: 100%; background: lightsalmon;;" class="swish__item_inner"></div>
      </li>
      <li class="swish-list__item">
        <div style="height: 300px; width: 100%; background: lightseagreen;" class="swish__item_inner"></div>
      </li>
      <li class="swish-list__item">
        <div style="height: 300px; width: 100%; background: purple;" class="swish__item_inner"></div>
      </li>
      <li class="swish-list__item">
        <div style="height: 300px; width: 100%; background: yellow;" class="swish__item_inner"></div>
      </li>
    </ul>
  </div>
  <button data-direction="prev">PREV</button>
  <button data-direction="next">PREV</button>
</div>
```

#### Step 2

Add this script before close tag `</body>` or in `<head></head>`

```
<script src="./scripts/swish.js"></script>
```

#### Step 3

Add this script after `swish.js`

```
<script>
  swish({
    selector: document.querySelectorAll('.swish'),
    config: {
      speed: 0.3
    },
  })
</script>
```

#### Step 4

Add in your `<head></head>` required.css or in your css file

```
<link rel="stylesheet" href="./styles/required.css">
```

#### Step 5

Сustomize slider, as an example see file `theme.css`

---

### Availibele config settings

- slides

  - type: `number`
  - default: `1`

* shifted
  - type: `number`
  - default: `0`

- infinity

  - type: `bool`
  - default: `false`

* pagination

  - type: `bool`
  - default: `false`

- responsive
  - type: `object`
  - default: `undefined`

* speed
  - type: `number`
  - default: `0`

---

### Example config

```
config: {
  slides: 1,
  speed: 0.3,
  infinity: false,
  pagination: true,
  responsive: {
    800: {
      slides: 2,
      infinity: true,
      pagination: true,
      shifted: 0,
    },
    600: {
      slides: 1,
      shifted: 100,
      infinity: true,
      pagination: true,
    }
  }
}
```

## Future :rocket:

- lazy loading
- autoplay
- thumbnails
