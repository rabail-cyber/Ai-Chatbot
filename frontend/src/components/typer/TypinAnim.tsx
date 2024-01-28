import { TypeAnimation } from "react-type-animation"

const TypingAnim = () =>{
    return (
        <TypeAnimation 
        sequence={[
        // Same substring at the start will only be typed out once, initially
        'Chat with your own AI',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Built with OpenAI 🤖',
        2000,
        'Your Own Customized ChatGPT 💻',
        1500,
        ]}
        speed= {50}
        style={{
            fontSize: "60px",
            color: "white",
            display: "inline-block",
            textShadow: "1px 1px 20px #000",
        }}
        repeat={Infinity}
        />

        
    )
}
export default TypingAnim;