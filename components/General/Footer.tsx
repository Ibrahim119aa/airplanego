import Image from "next/image";
import Link from "next/link";
const Footer = () => {
    return (
        <div data-aos="zoom-in" data-duration="1000" className="Parent-Layout bg-white">
            <div className="Parent-Child pt-6 pb-4">
                <div className="grid grid-cols-6 ">
                    <div className="col-span-1 flex  flex-col gap-5">
                        <div>
                            <Image
                                className="w-[8rem] h-[7rem]"
                                width={80}
                                height={50}
                                src={"/assets/images/logo.png"}
                                alt=""
                            />
                        </div>
                        <div className="flex gap-2">
                            <a href="" className="no-underline">
                                <svg className=" social-media-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" data-test="Footer-IconInstagram" aria-hidden="true"><path d="M8.024 2.467c-1.022.048-1.72.211-2.329.45a4.698 4.698 0 0 0-1.698 1.111A4.703 4.703 0 0 0 2.893 5.73c-.237.61-.397 1.309-.442 2.33-.045 1.023-.055 1.351-.05 3.958.005 2.607.016 2.934.066 3.958.049 1.022.211 1.719.45 2.329a4.702 4.702 0 0 0 1.111 1.698c.534.533 1.07.86 1.703 1.104.61.236 1.309.397 2.33.442 1.023.045 1.351.055 3.958.05 2.606-.005 2.934-.016 3.958-.065s1.718-.212 2.328-.45a4.705 4.705 0 0 0 1.698-1.111c.532-.535.86-1.07 1.104-1.703.236-.61.397-1.309.442-2.33.044-1.025.055-1.352.05-3.958-.005-2.607-.017-2.934-.066-3.958-.048-1.023-.21-1.719-.45-2.329a4.712 4.712 0 0 0-1.11-1.698 4.684 4.684 0 0 0-1.703-1.104c-.61-.236-1.309-.397-2.33-.442-1.022-.044-1.351-.055-3.958-.05-2.608.005-2.934.016-3.958.066Zm.112 17.355c-.936-.04-1.444-.196-1.783-.326a2.989 2.989 0 0 1-1.105-.716 2.957 2.957 0 0 1-.72-1.103c-.132-.339-.29-.846-.334-1.782-.048-1.012-.058-1.316-.063-3.879-.006-2.563.004-2.866.048-3.878.04-.936.197-1.444.327-1.783.172-.449.38-.768.716-1.105a2.964 2.964 0 0 1 1.102-.72c.339-.133.846-.29 1.782-.334 1.012-.048 1.316-.058 3.878-.063 2.563-.006 2.867.004 3.88.048.935.04 1.444.196 1.782.327.45.172.768.38 1.106.716.337.335.545.654.72 1.103.133.337.29.844.334 1.78.048 1.013.059 1.317.063 3.88.005 2.562-.004 2.866-.048 3.878-.041.936-.196 1.444-.327 1.783a2.976 2.976 0 0 1-.716 1.105 2.967 2.967 0 0 1-1.103.72c-.338.132-.846.29-1.78.334-1.013.048-1.317.058-3.88.063-2.564.006-2.866-.004-3.879-.048m7.826-12.953a1.152 1.152 0 1 0 2.305-.004 1.152 1.152 0 0 0-2.305.004Zm-8.891 5.14a4.929 4.929 0 1 0 9.858-.018 4.929 4.929 0 0 0-9.858.019Zm1.729-.003a3.2 3.2 0 1 1 6.4-.013 3.2 3.2 0 0 1-6.4.013Z"></path></svg>

                            </a>
                            <a href="" className="no-underline">
                                <svg className="social-media-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" data-test="Footer-IconTwitter" aria-hidden="true"><path d="M17.521 3.312h2.944l-6.432 7.352L21.6 20.666h-5.925l-4.64-6.067-5.31 6.067H2.78l6.88-7.863L2.4 3.312h6.075l4.195 5.546 4.851-5.546Zm-1.033 15.593h1.631L7.59 4.982h-1.75l10.649 13.923Z"></path></svg>

                            </a>
                            <a href="" className="no-underline">
                                <svg className="social-media-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" data-test="Footer-IconLinkedin" aria-hidden="true"><path d="M18.76 18.76h-2.845v-4.456c0-1.062-.019-2.43-1.48-2.43-1.482 0-1.708 1.158-1.708 2.353v4.532H9.882V9.598h2.731v1.252h.038a2.993 2.993 0 0 1 2.695-1.48c2.883 0 3.415 1.896 3.415 4.364l-.001 5.026ZM6.672 8.345a1.651 1.651 0 1 1 0-3.302 1.651 1.651 0 0 1 0 3.302ZM8.094 18.76H5.246V9.598h2.848v9.162ZM20.178 2.4H3.817A1.401 1.401 0 0 0 2.4 3.785v16.43A1.402 1.402 0 0 0 3.817 21.6h16.361a1.405 1.405 0 0 0 1.423-1.386V3.785A1.404 1.404 0 0 0 20.178 2.4"></path></svg>

                            </a>
                            <a href="" className="no-underline">
                                <svg className="social-media-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" data-test="Footer-IconFacebook" aria-hidden="true"><path d="M21.6 12.035C21.6 6.714 17.302 2.4 12 2.4s-9.6 4.314-9.6 9.635c0 4.519 3.1 8.31 7.28 9.352V14.98H7.702v-2.945h1.98v-1.268c0-3.28 1.479-4.8 4.687-4.8.608 0 1.657.12 2.086.24v2.668c-.226-.023-.62-.035-1.109-.035-1.574 0-2.182.598-2.182 2.154v1.041h3.136l-.539 2.945h-2.597v6.62c4.753-.576 8.437-4.639 8.437-9.565Z"></path></svg>

                            </a>

                        </div>
                        <div className="flex gap-3">
                            <div className="Circle">
                                <svg className="social-media-small-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M19.5 8.48c-.088.054-2.166 1.17-2.166 3.647.098 2.824 2.623 3.814 2.666 3.814-.043.053-.381 1.35-1.382 2.708C17.824 19.82 16.942 21 15.603 21c-1.273 0-1.73-.78-3.2-.78-1.578 0-2.024.78-3.232.78-1.34 0-2.286-1.243-3.124-2.403-1.088-1.517-2.013-3.899-2.046-6.186-.022-1.211.218-2.402.827-3.414.86-1.413 2.395-2.371 4.07-2.403 1.285-.042 2.428.854 3.211.854.751 0 2.155-.854 3.744-.854.686 0 2.514.2 3.647 1.887ZM12 6.353c-.228-1.107.403-2.213.99-2.919C13.743 2.579 14.929 2 15.952 2a4.047 4.047 0 0 1-1.088 2.982c-.664.854-1.807 1.497-2.862 1.37Z"></path></svg>
                            </div>
                            <div className="Circle">
                                <svg className="social-media-small-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="m6.232 20.165 7.036-7.35 2.48 2.59-8.365 4.858a1.003 1.003 0 0 1-1.023-.007l-.128-.091Zm6.327-8.092L5.85 19.08V5.065l6.709 7.008Zm4.192-2.896 3.277 1.903c.322.188.522.54.522.92s-.2.732-.522.92l-3.367 1.955-2.683-2.802 2.773-2.896ZM6.157 3.903a1.003 1.003 0 0 1 1.226-.167l8.455 4.911-2.57 2.684-7.11-7.428Z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-5 grid grid-cols-4  mt-4">
                        <div className="flex flex-col gap-2">
                            <h4 className="primary-heading">
                                Company
                            </h4>
                            <Link href={""} className="secondary-link">Terms & Condition</Link>
                            <Link href={""} className="secondary-link">Terms of Use</Link>
                            <Link href={""} className="secondary-link">Privacy Policy</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="primary-heading">
                                Platform

                            </h4>
                            <Link href={""} className="secondary-link">Terms & Condition</Link>
                            <Link href={""} className="secondary-link">Terms of Use</Link>
                            <Link href={""} className="secondary-link">Privacy Policy</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="primary-heading">
                                Features
                            </h4>
                            <Link href={""} className="secondary-link">Terms & Condition</Link>
                            <Link href={""} className="secondary-link">Terms of Use</Link>
                            <Link href={""} className="secondary-link">Privacy Policy</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="primary-heading">
                                Discover
                            </h4>
                            <Link href={""} className="secondary-link">Terms & Condition</Link>
                            <Link href={""} className="secondary-link">Terms of Use</Link>
                            <Link href={""} className="secondary-link">Privacy Policy</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer;