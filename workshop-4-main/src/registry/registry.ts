import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

const registeredNodes: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());
  const getNodeRegistryBody: GetNodeRegistryBody = { nodes: [] };


  // TODO implement the status route
  // _registry.get("/status", (req, res) => {});
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  




  //Question 3
 // /registerNode
 _registry.post("/registerNode", (req: Request<RegisterNodeBody>, res: Response) => {
  const { nodeId, pubKey } = req.body;
  getNodeRegistryBody.nodes.push({ nodeId, pubKey });
  res.json({ result: "success" });
});

// 3.4 allow users to retrieve the registry
// /getNodeRegistry
_registry.get("/getNodeRegistry", (req, res) => {
  res.json(getNodeRegistryBody);
});

const server = _registry.listen(REGISTRY_PORT, () => {
  console.log(`registry is listening on port ${REGISTRY_PORT}`);
});

  return server;
}