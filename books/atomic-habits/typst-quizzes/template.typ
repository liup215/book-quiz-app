// Atomic Habits 练习题模板
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  header: context [
    #if counter(page).get().first() > 1 [
      #text(size: 9pt, fill: gray)[
        Atomic Habits 练习题 — #chapter-title
      ]
    ]
  ],
  footer: context [
    #align(center)[
      #text(size: 9pt, fill: gray)[
        #counter(page).display("1")
      ]
    ]
  ],
)

#set text(font: ("Noto Serif CJK SC", "Source Han Serif SC", "SimSun"), size: 11pt, lang: "zh")
#set heading(numbering: none)

// 章节标题变量
#let chapter-title = state("chapter-title")

// 题型标签样式
#let type-label(t) = {
  let color = if t == "单选" { rgb("#4a90e2") }
    else if t == "多选" { rgb("#7ed321") }
    else if t == "判断" { rgb("#f5a623") }
    else if t == "填空" { rgb("#bd10e0") }
    else if t == "简答" { rgb("#d0021b") }
    else { rgb("#9b9b9b") }
  box(
    fill: color,
    radius: 3pt,
    inset: (x: 6pt, y: 2pt),
    text(size: 8pt, fill: white, weight: "bold", t)
  )
}

// 题目编号
#let q-counter = counter("question")
#let q-number() = context {
  q-counter.step()
  text(weight: "bold")[第 #q-counter.display() 题]
}

// 单选题
#let single-choice(q, options, answer: none) = {
  block(inset: 8pt, breakable: true)[
    #q-number() #h(5pt) #type-label("单选")
    #block(above: 6pt)[#q]
    #for (i, opt) in options.enumerate() {
      let prefix = ("A", "B", "C", "D", "E", "F").at(i)
      block(above: 3pt)[#prefix. #opt]
    }
    #if answer != none [
      #v(2pt)
      #text(size: 9pt, fill: gray)[参考答案：#answer]
    ]
  ]
  v(8pt)
}

// 多选题
#let multiple-choice(q, options, answer: none) = {
  block(inset: 8pt, breakable: true)[
    #q-number() #h(5pt) #type-label("多选")
    #block(above: 6pt)[#q]
    #for (i, opt) in options.enumerate() {
      let prefix = ("A", "B", "C", "D", "E", "F").at(i)
      block(above: 3pt)[#prefix. #opt]
    }
    #if answer != none [
      #v(2pt)
      #text(size: 9pt, fill: gray)[参考答案：#answer]
    ]
  ]
  v(8pt)
}

// 判断题
#let true-false(q, answer: none) = {
  block(inset: 8pt, breakable: true)[
    #q-number() #h(5pt) #type-label("判断")
    #block(above: 6pt)[#q]
    #block(above: 3pt)[（ ）]
    #if answer != none [
      #v(2pt)
      #text(size: 9pt, fill: gray)[参考答案：#if answer { "正确" } else { "错误" }]
    ]
  ]
  v(8pt)
}

// 填空题
#let gap-filling(q, blanks: 1, answer: none) = {
  block(inset: 8pt, breakable: true)[
    #q-number() #h(5pt) #type-label("填空")
    #block(above: 6pt)[#q]
    #if answer != none [
      #v(2pt)
      #text(size: 9pt, fill: gray)[参考答案：#answer]
    ]
  ]
  v(8pt)
}

// 简答题
#let short-answer(q, answer: none) = {
  block(inset: 8pt, breakable: true)[
    #q-number() #h(5pt) #type-label("简答")
    #block(above: 6pt)[#q]
    #v(30pt)
    #if answer != none [
      #text(size: 9pt, fill: gray)[参考答案：#answer]
    ]
  ]
  v(8pt)
}

// 章节标题页
#let chapter-page(title) = {
  pagebreak(to: "odd")
  
  chapter-title.update(title)
  align(center + horizon)[
    #text(size: 24pt, weight: "bold")[#title]
    #v(20pt)
    #text(size: 14pt, fill: gray)[练习题]
  ]
  pagebreak()
}
