# Practice 5 

Football Matchs DataBase

![GitHub](https://img.shields.io/github/license/lfresnog/Practica5)
![GitHub Release Date](https://img.shields.io/github/release-date/lfresnog/Practica5)
![GitHub last commit](https://img.shields.io/github/last-commit/lfresnog/Practica5)

## Install/Run

All the necessary packages are in the `package.json` file.

To install them, run this command:

```js
npm install
```

To run the programme in the server 4004

```js
npm start
```
## Query

- ok Test

```js
query{
  ok
}
```

## Mutations

- Add a team

```js
mutation{
  addTeam(name:"Team1"){
    name
  }
}
```

- Add a Match

```js
mutation{
  addMatch(local:"5df2470e9a5c6c291b4fb876",visitor:"5df24bb00c63ed2b70ed23c0",date:"18-12-2019",score:"0-0",play:false,end:false){
    local{
      name
    }
    visitor{
      name
    }
  }
}
```

- Update Score

```js
mutation{
  updateScore(match:"5df4fe24c951a3165cd428ab",score:"3-4"){
    local{
      name
    }
    visitor{
      name
    }
    score
  }
}
```

- Start/End a match

```js
mutation{
  startEnd(match:"5df4fe24c951a3165cd428ab",play:true){
    play
    end
  }
}

mutation{
  startEnd(match:"5df4fe24c951a3165cd428ab",end:true){
    play
    end
  }
}
```

- Subscription Match/Team

```js
subscription{
  tellMe(id:"5df4fe24c951a3165cd428ab")
}

subscription{
  tellMe(id:"5df2470e9a5c6c291b4fb876")
}
```

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/JaimeDordio/rickymorty/blob/master/LICENSE) file for details

**[⬆ back to top](#features)**
