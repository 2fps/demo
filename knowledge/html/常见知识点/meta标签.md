## meta标签
meta标签：提供给页面的一些元信息（名称/值对）， 比如针对搜索引擎和更新频度的描述和关键词。

### name
名称/值对中的名称。常用的有author、description、keywords、generator、revised、others。 把 content 属性关联到一个名称。

### http-equiv
没有name时，会采用这个属性的值。常用的有content-type、expires、refresh、set-cookie。把content属性关联到http头部。

### content
名称/值对中的值， 可以是任何有效的字符串。 始终要和 name 属性或 http-equiv 属性一起使用。