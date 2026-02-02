// Stage exports
export { researchStage } from "./research"
export { scriptStage } from "./script"
export { voiceStage } from "./voice"
export { musicStage } from "./music"
export { visualStage } from "./visual"
export { editorStage } from "./editor"
export { publishStage } from "./publish"

// Type exports
export * from "./types"

// Stage registry
import { StageHandler } from "./types"
import { researchStage } from "./research"
import { scriptStage } from "./script"
import { voiceStage } from "./voice"
import { musicStage } from "./music"
import { visualStage } from "./visual"
import { editorStage } from "./editor"
import { publishStage } from "./publish"
import { StageName } from "@prisma/client"

export const STAGE_HANDLERS: Record<StageName, StageHandler> = {
  RESEARCH: researchStage,
  SCRIPT: scriptStage,
  VOICE: voiceStage,
  MUSIC: musicStage,
  VISUAL: visualStage,
  EDITOR: editorStage,
  PUBLISH: publishStage,
}

export function getStageHandler(stageName: StageName): StageHandler {
  return STAGE_HANDLERS[stageName]
}
