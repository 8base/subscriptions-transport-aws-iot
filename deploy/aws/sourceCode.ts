import * as archiver from "archiver";
import * as path from "path";
import * as fs from "fs";
import { functions } from "./predefine";

const pathToActions = path.join("deploy", "actions");

export namespace SourceCode {

    export async function archive(config: string, ): Promise<{ path: string } > {

        const lib = path.join(__dirname, "../../");
        const root = path.join(__dirname, "../../../");
        const deployFile = path.join(root, 'deploy.zip');
        const output = fs.createWriteStream(deployFile);
        const nodeModulesPath = path.join(root, "node_modules");

        const archive = archiver('zip', {});

        archive.pipe(output);

        archive.append(config, { name: path.join("deploy", "actions", "config.json") });

        let indexFile = "";
        functions.map(f => indexFile+=`exports.${f.name} = require("./${path.join(pathToActions, f.name)}");\n`);
        archive.append(indexFile, { name: "index.js" });

        // [
        //     "aws-iot-device-sdk", "mqtt", "minimist", "websocket-stream", "crypto-js",
        //     "buffer", "events", "ieee754", "jmespath", "querystring", "sax", "url",
        //     "uuid", "xml2js", "xmlbuilder", "xtend", "readable-stream",
        //     "commist", "concat-stream", "end-of-stream", "help-me", "inherits",
        //     "mqtt-packet", "pump", "reinterval", "split2",
        //     "core-util-is", "isarray", "process-nextick-args", "safe-buffer",
        //     "string_decoder", "util-deprecate", "once", "wrappy",
        //     "MQTT", "packet", "parse", "publish", "subscribe", "pubsub"
        // ]
        const skip = ["@types", ".bin" , "npm", "core", "lodash"];
        fs.readdirSync(nodeModulesPath)
            .map(m => {
                if (skip.includes(m)) {
                    console.log("skip = " + m);
                    return;
                }
                archive.directory(path.join(nodeModulesPath, m), path.join("node_modules", m));
            });

        archive.directory(path.join(lib, "src"), "src");
        archive.directory(path.join(lib, "deploy", "actions"), path.join("deploy", "actions"));

        return new Promise<{path: string}>((resolve, reject) => {

            archive.on("end", async () => {
                resolve( {
                    path: deployFile
                });
            });

            archive.on('error', function(err: Error) {
                reject(err);
            });

            archive.finalize();
        });
    }

    export function removeArchive(archive: string) {
        fs.unlinkSync(archive);
    }


}
