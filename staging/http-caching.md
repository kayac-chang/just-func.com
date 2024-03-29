---
meta:
  - title: 關於 HTTP Caching
  - name: description
    content: 了解 Binary Search 是什麼，它的原理，以及它在 JavaScript 中如何應用
  - name: keywords
    content: binary search, javascript, algorithm

published: 2023-10-23
---

這篇文章記錄下我看完 [HTTP Caching][rfc9111] httpwg 規格後的一些重點整理跟心得。

## 什麼是 HTTP Cache？

HTTP Cache 是一種在本地端用來儲存 HTTP response 的子系統，
在未來做相同 request 時可以減少回應時間以及網路頻寬消耗。
無論是 Client 或 Server 都可能用到 HTTP Cache。

### HTTP Cache 的種類

HTTP Cache 大致可以分成兩種：

- Shared Cache
  是指多個 Client 可以共用的 Cache，例如 Proxy Server 上的 Cache。
- Private Cache
  是指只有一個 Client 可以使用的 Cache，例如瀏覽器上的 Cache。

## HTTP Cache 的狀態

HTTP Cache 狀態大致上分兩種：

- Fresh
  是指 Cache 的資料是新的，可以不需要重新驗證即可重複使用，
- Stale
  是指 Cache 的資料是舊的，需要被重新驗證。
  但它可能還是會被重複使用，像是 server 無法正常運作時。

> 這裡的重新驗證是指發送一個 request 到 Server 確認資料是否有更新。

## 概括 HTTP Cache 處理方式

基本上我們可以把 HTTP Cache 視作預設行為，
換句話說，即便我們沒有特別去處理它，系統的預設就是會 Cache。
所以，在探討 HTTP Cache 時大多是討論如何避免 Cache 到不能重用的資源以及避免使用到舊資源，
而不是明確命令系統去 Cache 。

## Cache Key

Cache 簡單來說就是一種 key-value 存儲，
而 Cache Key 是用來找到相對應 Cache 資源的唯一值。

大多數情況 HTTP cache 只會對 GET request 進行 Cache，
所以可以當作 URI 就是 Cache Key。

也會有情況是同樣的 request URI 對應到多種不同的 response，
這時候就會需要用到 Vary header 來區分不同的 response。

大多數情況下，
系統只會在 GET request 成功回應後 (也就是 200) 才會將 response Cache 起來，
但 Cache 也可能會出現在 redirect (3xx) 或 not found (4xx) 或是 incomplete (206)，
非 GET 的 response 也有機會被 Cache。

正常當系統無法連線到來源伺服器 (origin) 或無法找到 request 的路徑時，cache 就會中斷。
但在某些情況下，系統可能會使用 stale response。

[rfc9111]: https://httpwg.org/specs/rfc9111.html
