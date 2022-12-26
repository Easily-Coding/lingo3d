type JointProps = {
    x: number
    y: number
}

const Joint = ({ x, y }: JointProps) => {
    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50 - 2 + x + "%",
                top: y + "%",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.2)"
            }}
        />
    )
}

export default Joint