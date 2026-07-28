import Image from "next/image";
import Link from "next/link";
import img from "../images/we-are-p4.png";

export default function Initiatives({ id, data }) {

  return (
    <section className="sp-for-good-sec" id={id}>
      <div className="container">
        <div className="spFor-good-in gap-left">
            <div className="heading">
                <h2 className="reveal-heading">SimplePlan for Good</h2>
            </div>

            <div className="spFor-good-grid">
                <div className="for-good-img">
                    <Image
                        src={img}
                        alt="adc"
                        className="img"
                    />
                </div>
                <div className="for-good-info">
                    <p>While we love bringing brands to life, we also recognise a larger world that needs kindness and humanity. That’s why SimplePlan collaborates with non-profits to create meaningful impact.</p>
                    <div className="for-good-cta">
                        <Link href="#" className="custom-btn">
                            <span>view our initiatives</span>
                            <span className="arrow-wrap">
                                <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                    <path
                                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z" 
                                            fill="currentColor" />
                                </svg>

                                <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                    <path
                                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                                            fill="currentColor" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}