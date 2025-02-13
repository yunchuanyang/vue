/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag                                   //当前节点的标签名
    this.data = data                                 //当前节点对应的对象，包含了具体的一些数据信息，是一个vnodedata类型
    this.children = children                         //当前节点的子节点，是一个数组
    this.text = text                                 //当前节点的文本
    this.elm = elm                                   //当前虚拟节点对应的真实dom节点
    this.ns = undefined                              //当前节点的名字空间
    this.context = context                           //当前组件节点对应的vue实例
    this.fnContext = undefined                       //函数式组件对应的vue实例
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key                      //节点的key属性，被当做节点的标志，用以优化
    this.componentOptions = componentOptions         //组件的option选项
    this.componentInstance = undefined               //当前节点对应的组件的实例
    this.parent = undefined                          //当前节点的父节点
    this.raw = false                                 //是否为原生HTML或者只是普通文本，innerHTML的时候为true,textcontent时为false
    this.isStatic = false                            //静态节点标志
    this.isRootInsert = true                         //是否作为根节点插入
    this.isComment = false                           //是否为注释节点
    this.isCloned = false                            //是否为克隆节点
    this.isOnce = false                              //是否有v-once指令
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
//创建注释节点：没有标签，只有注释信息text
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true     //标志为注释节点
  return node
}
//创建文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
//创建克隆节点：把一个已存在的节点复制一个出来，主要是模板编译优化时使用
// 把已有节点的属性全部复制到新节点中去，唯一不同的是新节点isCloned属性是true
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
