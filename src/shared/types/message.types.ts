/**
 * web消息类型
 */
export const RendererWebMessageTypes = {
    TEST_MESSAGE: 'test-message'
} as const

/**web消息类型 */
export type RendererWebMessageType = (typeof RendererWebMessageTypes)[keyof typeof RendererWebMessageTypes]

export interface RendererMessagePayloads {
    [RendererWebMessageTypes.TEST_MESSAGE]: undefined
}
