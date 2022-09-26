## Kill port

```bash
k() {
  lsof -t -i tcp:$1 | xargs kill -9
}
```

- Usage

  ```
  k 3000
  ```

## Reload oh-my-szh

```
omz reload
```
