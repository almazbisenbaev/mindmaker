export default function Footer(){
    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
            Made by{" "}
            <a
                href="https://almaz.vercel.app"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
            >
                Almaz Bisenbaev
            </a>
            </p>
        </footer>
    )
}