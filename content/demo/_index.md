---
title: Demoページ
---

# 1. Markdownチェック

## コードブロック
```
    ```
    allow any-user to manage objects in compartment id ocid1.compartment.oc1..xxxxxxxxxx where all {request.principal.type='serviceconnector', target.bucket.name='bucket01', request.principal.compartment.id='ocid1.compartment.oc1..xxxxxxxxxx'}
    ```
```

```
allow any-user to manage objects in compartment id ocid1.compartment.oc1..xxxxxxxxxx where all {request.principal.type='serviceconnector', target.bucket.name='bucket01', request.principal.compartment.id='ocid1.compartment.oc1..xxxxxxxxxx'}
```

```
    ```text
    allow any-user to manage objects in compartment id ocid1.compartment.oc1..xxxxxxxxxx where all {request.principal.type='serviceconnector', target.bucket.name='bucket01', request.principal.compartment.id='ocid1.compartment.oc1..xxxxxxxxxx'}
    ```
```

```text
allow any-user to manage objects in compartment id ocid1.compartment.oc1..xxxxxxxxxx where all {request.principal.type='serviceconnector', target.bucket.name='bucket01', request.principal.compartment.id='ocid1.compartment.oc1..xxxxxxxxxx'}
```



## 見出し
```
# 見出し1
## 見出し2
### 見出し3
```

# 見出し1
## 見出し2
### 見出し3

## 強調
```
**太字**
*斜体*
~~取り消し線~~
```

**太字**  
*斜体*  
~~取り消し線~~

## リスト
```
- 箇条書き1
- 箇条書き2
  - ネスト1
    - ネスト2
```

- 箇条書き1
- 箇条書き2
  - ネスト1
    - ネスト2

```
1. 番号付きリスト1
2. 番号付きリスト2
   1. ネスト1
```

1. 番号付きリスト1
2. 番号付きリスト2
   1. ネスト1

## リンクと画像
```
[リンクテキスト](https://www.oracle.com/)

![代替テキスト](https://www.oracle.com/a/pr/img/rc24-database-23ai.jpg)
```

[リンクテキスト](https://www.oracle.com/)

![代替テキスト](https://www.oracle.com/a/pr/img/rc24-database-23ai.jpg)


## 引用
```
> これは引用です
>> 二重引用です
```

> これは引用です
>> 二重引用です

## コード
```
インラインコード: `print("Hello")`

コードブロック:
    ```python
    def hello():
        print("Hello World")
    ```
```

インラインコード: `print("Hello")`

コードブロック:
```python
def hello():
    print("Hello World")
```

## 表
```
| 列1 | 列2 | 列3 |
| --- | --- | --- |
| A1  | B1  | C1  |
| A2  | B2  | C2  |
```

| 列1 | 列2 | 列3 |
| --- | --- | --- |
| A1  | B1  | C1  |
| A2  | B2  | C2  |



## 水平線
```
---
```

---


# 2. Shortcodes - Hints
```
{{</* hint type=[note|tip|important|caution|warning] (icon=gdoc_github) (title=GitHub) */>}}
**Markdown content**\
Dolor sit, sumo unique argument um no. Gracie nominal id xiv. Romanesque acclimates investiture.
 Ornateness bland it ex enc, est yeti am bongo detract re.
{{</* /hint */>}}
```

```
{{</* hint type=note icon=gdoc_github title=GitHub */>}}
**Markdown content**\
Dolor sit, sumo unique argument um no. Gracie nominal id xiv. Romanesque acclimates investiture.
Ornateness bland it ex enc, est yeti am bongo detract re.
{{</* /hint */>}}
```

{{< hint type=note icon=gdoc_github title=GitHub >}}
**Markdown content**\
Dolor sit, sumo unique argument um no. Gracie nominal id xiv. Romanesque acclimates investiture.
Ornateness bland it ex enc, est yeti am bongo detract re.
{{< /hint >}}

```
{{</* hint type=caution title=example */>}}
zzzzzzzzzzzzz\
yyyyyy\
oooooooooooooooooooooo
{{</* /hint */>}}
```
{{< hint type=caution title=**example** >}}
zzzzzzzzzzzzz\
yyyyyy\
oooooooooooooooooooooo
{{< /hint >}}

## 例

{{< hint type=note >}}
xxxxxxxx
{{< /hint >}}

{{< hint type=tip >}}
xxxxxxxx
{{< /hint >}}

{{< hint type=important >}}
xxxxxxxx
{{< /hint >}}

{{< hint type=caution >}}
xxxxxxxx
{{< /hint >}}

{{< hint type=warning >}}
xxxxxxxx  
yyyyyyyy
{{< /hint >}}

## SREチーム記入