import { traverseHtml } from '../../plugins/html'
import { ssrTransform } from '../ssrTransform'

test('default import', async () => {
  expect(
    (await ssrTransform(`import foo from 'vue';console.log(foo.bar)`, null))
      .code
  ).toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")
    console.log(__vite_ssr_import_0__.default.bar)"
  `)
})

test('named import', async () => {
  expect(
    (
      await ssrTransform(
        `import { ref } from 'vue';function foo() { return ref(0) }`,
        null
      )
    ).code
  ).toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")
    function foo() { return __vite_ssr_import_0__.ref(0) }"
  `)
})

test('namespace import', async () => {
  expect(
    (
      await ssrTransform(
        `import * as vue from 'vue';function foo() { return vue.ref(0) }`,
        null
      )
    ).code
  ).toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")
    function foo() { return __vite_ssr_import_0__.ref(0) }"
  `)
})

test('export function decl', async () => {
  expect((await ssrTransform(`export function foo() {}`, null)).code)
    .toMatchInlineSnapshot(`
    "function foo() {}
    Object.defineProperty(__vite_ssr_exports__, \\"foo\\", { get(){ return foo }})"
  `)
})

test('export class decl', async () => {
  expect((await ssrTransform(`export class foo {}`, null)).code)
    .toMatchInlineSnapshot(`
    "class foo {}
    Object.defineProperty(__vite_ssr_exports__, \\"foo\\", { get(){ return foo }})"
  `)
})

test('export var decl', async () => {
  expect((await ssrTransform(`export const a = 1, b = 2`, null)).code)
    .toMatchInlineSnapshot(`
    "const a = 1, b = 2
    Object.defineProperty(__vite_ssr_exports__, \\"a\\", { get(){ return a }})
    Object.defineProperty(__vite_ssr_exports__, \\"b\\", { get(){ return b }})"
  `)
})

test('export named', async () => {
  expect(
    (await ssrTransform(`const a = 1, b = 2; export { a, b as c }`, null)).code
  ).toMatchInlineSnapshot(`
    "const a = 1, b = 2; 
    Object.defineProperty(__vite_ssr_exports__, \\"a\\", { get(){ return a }})
    Object.defineProperty(__vite_ssr_exports__, \\"c\\", { get(){ return b }})"
  `)
})

test('export named from', async () => {
  expect(
    (await ssrTransform(`export { ref, computed as c } from 'vue'`, null)).code
  ).toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")

    Object.defineProperty(__vite_ssr_exports__, \\"ref\\", { get(){ return __vite_ssr_import_0__.ref }})
    Object.defineProperty(__vite_ssr_exports__, \\"c\\", { get(){ return __vite_ssr_import_0__.computed }})"
  `)
})

test('named exports of imported binding', async () => {
  expect(
    (
      await ssrTransform(
        `import {createApp} from 'vue';export {createApp}`,
        null
      )
    ).code
  ).toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")

    Object.defineProperty(__vite_ssr_exports__, \\"createApp\\", { get(){ return __vite_ssr_import_0__.createApp }})"
  `)
})

test('export * from', async () => {
  expect((await ssrTransform(`export * from 'vue'`, null)).code)
    .toMatchInlineSnapshot(`
    "const __vite_ssr_import_0__ = __vite_ssr_import__(\\"vue\\")

    __vite_ssr_exportAll__(__vite_ssr_import_0__)"
  `)
})

test('export default', async () => {
  expect(
    (await ssrTransform(`export default {}`, null)).code
  ).toMatchInlineSnapshot(`"__vite_ssr_exports__.default = {}"`)
})

test('import.meta', async () => {
  expect(
    (await ssrTransform(`console.log(import.meta.url)`, null)).code
  ).toMatchInlineSnapshot(`"console.log(__vite_ssr_import_meta__.url)"`)
})

test('dynamic import', async () => {
  expect(
    (await ssrTransform(`export const i = () => import('./foo')`, null)).code
  ).toMatchInlineSnapshot(`
    "const i = () => __vite_ssr_dynamic_import__('./foo')
    Object.defineProperty(__vite_ssr_exports__, \\"i\\", { get(){ return i }})"
  `)
})
