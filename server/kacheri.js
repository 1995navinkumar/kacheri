import { uuid } from "./utils.js";
const kacheris = {};

export function CreateKacheri({ uid }) {
  const id = uid ?? uuid();
  const rasigars = {};
  let dj;

  function setDJ({ clientId }) {
    dj = clientId;
  }

  function getDJ() {
    return dj;
  }

  function addRasigar({ clientId }) {
    rasigars[clientId] = true;
  }

  function getRasigar({ clientId }) {
    return rasigars[clientId];
  }

  const kacheri = {
    setDJ,
    getDJ,
    addRasigar,
    getRasigar,
    id,
    rasigars,
  };

  kacheris[id] = kacheri;

  return kacheri;
}

export function getKacheri({ id }) {
  return kacheris[id];
}

export function deleteKacheri({ id }) {
  return delete kacheris[id];
}
