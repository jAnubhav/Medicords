import React from "react";

const Affiliations = () => {
    const data = [1, 2, 3, 4, 5, 6];

    return (
        <section className="flex flex-wrap justify-center gap-5 p-10 bg-base-300">
            {data.map(e => {
                return (
                    <div key={e} className="card bg-base-100 w-90 shadow-sm">
                        <figure>
                            <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                        </figure>

                        <div className="card-body">
                            <h2 className="card-title">Card Title</h2>
                            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default Affiliations;