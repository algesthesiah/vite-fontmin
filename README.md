# vite-fontmin

A rollup plugin to minify font. based on [Fontmin](https://github.com/ecomfe/fontmin).

## QUICK START

### install

> npm install -D vite-fontmin

### usage

#### vite

```typescript
{
  plugins:[
      ViteFontmin({
        fontSrc: './src/assets/font/*.*',
        fontDest: './public/font',
        fileExt: ['ts'],
        include: 'src/locales/**/*',
      }),
   ]
}
```

## API

| key      | type               | description                                                                     | default                                                         |
| -------- | ------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| fontSrc  | string             | needs minify fonts file src                                                     | './public/font/\*.*'                                            |
| fontDest | string             | minified fonts output file src                                                  | './dist/font'                                                   |
| include  | string[] or string | scan folders or files based on [fast-glob](https://github.com/mrmlnc/fast-glob) | 'src/**/*'                                                      |
| fileExt  | string[] or string | scan files extension list                                                       | 'ts', 'js', 'tsx', 'jsx', 'vue', 'scss', 'sass', 'html', 'json' |
| exclude  | string[] or string | exclude folders or files                                                        | ''                                                              |
