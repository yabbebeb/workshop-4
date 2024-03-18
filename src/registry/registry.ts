import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string; privKey?: string};

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  _registry.get("/status", (req, res) => {
    res.send('live');
  });

  let nodes: Node[] = [];

  _registry.post('/registerNode', (req, res) => {
    const {nodeId, pubKey} = req.body;
    if (!nodeId || !pubKey) {
      res.status(400).send("Invalid request body");
      return;
    }
    const nodeExists = nodes.some((node) => node.nodeId === nodeId);
    const pubKeyExists = nodes.some((node) => node.pubKey === pubKey);
    console.log(`Registering node: ${nodeId}`);

    if (nodeExists) {
      res.status(400).send("Node already exists");
    } else if (pubKeyExists) {
      res.status(400).send("Public key already exists");
    } else {
      nodes.push({nodeId, pubKey});
      res.status(200).send("Node registered successfully");
    }
  });

  _registry.get("/getNodeRegistry", (req, res) => {
    const registry: GetNodeRegistryBody = { nodes };
    res.status(200).json(registry);
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}