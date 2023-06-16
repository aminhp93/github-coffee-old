# Github Coffee: where developers can ask and connect

Github Coffee is a platform and interactive tool that makes it easy to work with daily task and get only informative news.

[https://github-coffee.vercel.app/](https://github-coffee.vercel.app/)

## Installation

Install package

```sh
yarn install
```

Run

```sh
yarn start
```

## Structure

## Note

```sh
--no-verify
```

## Documentation

- Update firebase
  - [Project settings](https://console.firebase.google.com/project/reactjs-with-redux/settings/general/web:NzVmMTRkN2QtYTU1NC00ZTZhLTlkMDEtODA0NTRmNzY4Nzlk)
  - [Authentication](https://console.firebase.google.com/project/reactjs-with-redux/authentication/users)
- [Github auth](https://github.com/settings/applications/1970962)

## Structure folder for template

        ├── docs
        │   └── README.md
        ├── features
        │   ├── counter
        │   │   ├── Counter.css
        │   │   ├── Counter.tsx
        │   │   └── Counter.spec.tsx
        │   │   └── counterAPI.ts
        │   │   └── counterSlice.ts
        │   │   └── counterType.ts
        │   │   └── counterUtil.ts
        ├── components
        │   ├── Loading.tsx
        ├── styles
        │   ├── globals.css
        ├── request.ts
        ├── utils.ts
        ├── package.json
        ├── tsconfig.json
        ├── README.md

## API

- [Swagger](https://app.swaggerhub.com/apis/aminhp93/github-coffee/1.0.0#/info)

## Current template

- [React Typescript Template](https://github.com/aminhp93/react-typescript-template)

- [Next Typescript Template](https://github.com/aminhp93/next-typescript-template)

- [React Native Typescript Template](https://github.com/aminhp93/react-native-typescript-template)

## Convention

-

```
import { useEffect } from 'react' ✅
import * from 'react' ❌
```

- Nameing and Grouping import

```
// ** Import React
import { useEffect } from 'react'

// ** Import Components
import Chat from '@/components/chat'
```

// Add
1
