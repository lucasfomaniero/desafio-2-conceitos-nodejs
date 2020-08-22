const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository)

    return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: `Repository with ID ${id} doesn't exist.`});
  }

  const oldRepository = repositories[repositoryIndex];

  const updatedRepository = {
      id,
      title,
      url,
      techs,
      likes: oldRepository.likes
  };

  repositories[repositoryIndex] = updatedRepository;

  response.status(202).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: `The repository with ID ${id} doesn't exist.`});
  }

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({});
  }
  
  const {title, url, techs, likes} = repositories[repositoryIndex];

  const newRepository = {id, title, url, techs, likes: likes + 1};
  repositories[repositoryIndex] = newRepository;

  return response.status(202).json(newRepository);
});

module.exports = app;
