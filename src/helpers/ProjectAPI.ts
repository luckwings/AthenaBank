import { ProjectDetailModel } from "../models/ProjectDetailModel";
import { get } from "./basic-fetch";

const ProjectAPI = {
    getAll: () => get<ProjectDetailModel[]>("project"),
    get: (projectAddress: string) => get<ProjectDetailModel>(`project/${projectAddress}`)
}

export default ProjectAPI;