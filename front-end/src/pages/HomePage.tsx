import { Link } from "react-router-dom";


function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/add-room">Add Room</Link>
        </div>
    )
}

export default HomePage;