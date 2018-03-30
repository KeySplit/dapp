import React, { Component } from 'react';

class Terms extends Component {

    componentWillMount = () => {
        if (typeof window.web3 === 'undefined' || typeof window.web3 === undefined){
            this.props.history.push('/web3');
        }
    }
    
    render() {
        return (
            <div className="terms">
                <h1>Terms of Use</h1>
                <p>Last Update: March 29, 2018</p>
                <p>
                    KEYSPLIT IS CURRENTLY IN BETA TESTING, PART OF WHICH INCLUDES SECURITY TESTING AND REVIEW. DO NOT ENTER REAL PRIVATE KEYS OR SEED PHRASES INTO THIS TOOL DURING THIS BETA TESTING PERIOD.
                </p>
                <p>
                    THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN SECTION 14. PLEASE READ THE AGREEMENT CAREFULLY.                </p>
                <p>
                    1. Acceptance of Terms<br/>
                    KeySplit provides an experimental tool for splitting private keys, through our website located at https://keysplit.io/ (the “Site”) — which includes text, images, audio, code and other materials (collectively, the “Content”) and all of the features, and services provided. The Site, and any other features, tools, materials, or other services offered from time to time by KeySplit are referred to here as the “Service.” Please read these Terms of Use (the “Terms” or “Terms of Use”) carefully before using the Service. By using or otherwise accessing the Services, or clicking to accept or agree to these Terms where that option is made available, you (1) accept and agree to these Terms (2) consent to the collection, use, disclosure and other handling of information as described in our Privacy Policy and (3) any additional terms, rules and conditions of participation issued by KeySplit from time to time. If you do not agree to the Terms, then you may not access or use the Content or Services.
                </p>
                <p>
                    2. Modification of Terms of Use<br/>
                    Except for Section 14, providing for binding arbitration and waiver of class action rights, KeySplit reserves the right, at its sole discretion, to modify or replace the Terms of Use at any time. The most current version of these Terms will be posted on our Site. You shall be responsible for reviewing and becoming familiar with any such modifications. Use of the Services by you after any modification to the Terms constitutes your acceptance of the Terms of Use as modified.
                </p>
                <p>
                    3. Eligibility<br/>
                    You hereby represent and warrant that you are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in these Terms and to abide by and comply with these Terms.<br/>
                    KeySplit is a global platform and by accessing the Content or Services, you are representing and warranting that, you are of the legal age of majority in your jurisdiction as is required to access such Services and Content and enter into arrangements as provided by the Service. You further represent that you are otherwise legally permitted to use the service in your jurisdiction including owning cryptographic tokens of value, and interacting with the Services or Content in any way. You further represent you are responsible for ensuring compliance with the laws of your jurisdiction and acknowledge that KeySplit is not liable for your compliance with such laws.
                </p>
                <p>
                    4. Account Password and Security<br/>
                    When setting up an account within KeySplit, you will be responsible for keeping your own account secrets, which may be a twelve-word seed phrase, an account file, or other locally stored secret information. KeySplit encrypts this information locally with a password you provide, that we never send to our servers. You agree to (a) never use the same password for KeySplit that you have ever used outside of this service; (b) keep your secret information and password confidential and do not share them with anyone else; (c) immediately notify KeySplit of any unauthorized use of your account or breach of security. KeySplit cannot and will not be liable for any loss or damage arising from your failure to comply with this section.
                </p>
                <p>
                    5. REPRESENTATIONS, WARRANTIES AND RISKS<br/>
                    5.1. Warranty disclaimer<br/>
                    You expressly understand and agree that your use of the Service is at your sole risk. The Service (including the Service and the Content) are provided on an “AS IS” and “as available” basis, without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose or non-infringement. You acknowledge that KeySplit has no control over, and no duty to take any action regarding: which users gain access to or use the Service; what effects the Content may have on you; how you may interpret or use the Content; or what actions you may take as a result of having been exposed to the Content. You release KeySplit from all liability for you having acquired or not acquired Content through the Service. KeySplit makes no representations concerning any Content contained in or accessed through the Service, and KeySplit will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Service.
                </p>
                <p>
                    5.2. Sophistication and Risk of Cryptographic Systems<br/>
                    By utilizing the Service or interacting with the Content or platform in any way, you represent that you understand the inherent risks associated with cryptographic systems; and warrant that you have an understanding of the usage and intricacies of cryptographic systems.
                </p>
                <p>
                    5.3. Risk of Regulatory Actions in One or More Jurisdictions<br/>
                    KeySplit could be impacted by one or more regulatory inquiries or regulatory action, which could impede or limit the ability of KeySplit to continue to develop, or which could impede or limit your ability to access or use the Service.
                </p>
                <p>
                    5.4. Risk of Weaknesses or Exploits in the Field of Cryptography<br/>
                    You acknowledge and understand that Cryptography is a progressing field. Advances in code cracking or technical advances such as the development of quantum computers may present risks to cryptocurrencies and Services of Content, which could result in the theft or loss of your cryptographic tokens or property. To the extent possible, KeySplit intends to update the protocol underlying Services to account for any advances in cryptography and to incorporate additional security measures, but does not guarantee or otherwise represent full security of the system. By using the Service or accessing Content, you acknowledge these inherent risks.
                </p>
                <p>
                    5.5. Application Security<br/>
                    You acknowledge that software applications are code subject to flaws and acknowledge that you are solely responsible for evaluating any code provided by the Services or Content and the trustworthiness of any third-party websites, products, or Content you access or use through the Service. You further expressly acknowledge and represent that software applications can be written maliciously or negligently, that KeySplit cannot be held liable for your interaction with such applications and that such applications may cause the loss of property or even identity. This warning and others later provided by KeySplit in no way evidence or represent an on-going duty to alert you to all of the potential risks of utilizing the Service or Content.
                </p>
                <p>
                    6. Indemnity<br/>
                    You agree to release and to indemnify, defend and hold harmless KeySplit and its parents, subsidiaries, affiliates and agencies, as well as the officers, directors, employees, shareholders and representatives of any of the foregoing entities, from and against any and all losses, liabilities, expenses, damages, costs (including attorneys’ fees and court costs) claims or actions of any kind whatsoever arising or resulting from your use of the Service, your violation of these Terms of Use, and any of your acts or omissions that implicate publicity rights, defamation or invasion of privacy. KeySplit reserves the right, at its own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by you and, in such case, you agree to cooperate with KeySplit in the defense of such matter.
                </p>
                <p>
                    7. Limitation on liability<br/>
                    YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR YOUR USE OF THE SITE AND SERVICE. YOU ACKNOWLEDGE AND AGREE THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITE AND SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SITE AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING SUCH, YOU UNDERSTAND AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER KEYSPLIT NOR ITS SUPPLIERS OR LICENSORS WILL BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT, TORT, STRICT LIABILITY OR ANY OTHER THEORY (EVEN IF KEYSPLIT HAD BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE SITE OR SERVICE; THE USE OR THE INABILITY TO USE THE SITE OR SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SITE OR SERVICE; ANY ACTIONS WE TAKE OR FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND TO US; HUMAN ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY OR TELEPHONE OUTAGES; OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE TO COMPUTER EQUIPMENT; INABILITY TO FULLY ACCESS THE SITE OR SERVICE OR ANY OTHER WEBSITE; THEFT, TAMPERING, DESTRUCTION, OR UNAUTHORIZED ACCESS TO, IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR INCORRECTLY OR IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR ANY COMBINATION THEREOF; OR ANY OTHER MATTER RELATING TO THE SITE OR SERVICE.<br/>
                    SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
                </p>
                <p>
                    8. Our proprietary rights<br/>
                    All title, ownership and intellectual property rights in and to the Service are owned by KeySplit or its licensors. You acknowledge and agree that the Service contains proprietary and confidential information that is protected by applicable intellectual property and other laws. Except as expressly authorized by KeySplit, you agree not to copy, modify, rent, lease, loan, sell, distribute, perform, display or create derivative works based on the Service, in whole or in part. KeySplit issues a license for KeySplit, found here.
                </p>
                <p>
                    9. Links<br/>
                    The Service provides, or third parties may provide, links to other World Wide Web or accessible sites, applications or resources. Because KeySplit has no control over such sites, applications and resources, you acknowledge and agree that KeySplit is not responsible for the availability of such external sites, applications or resources, and does not endorse and is not responsible or liable for any content, advertising, products or other materials on or available from such sites or resources. You further acknowledge and agree that KeySplit shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such site or resource.
                </p>
                <p>
                    10. Termination and suspension<br/>
                    KeySplit may terminate or suspend all or part of the Service and your KeySplit access immediately, without prior notice or liability, if you breach any of the terms or conditions of the Terms. Upon termination of your access, your right to use the Service will immediately cease.<br/>
                    The following provisions of the Terms survive any termination of these Terms: INDEMNITY; WARRANTY DISCLAIMERS; LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS; LINKS; TERMINATION; NO THIRD PARTY BENEFICIARIES; BINDING ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.
                </p>
                <p>
                    11. No third party beneficiaries<br/>
                    You agree that, except as otherwise expressly provided in these Terms, there shall be no third party beneficiaries to the Terms.
                </p>
                <p>
                    12. Notice and procedure for making claims of copyright infringement<br/>
                    If you believe that your copyright or the copyright of a person on whose behalf you are authorized to act has been infringed, please provide KeySplit’s Copyright Agent a written Notice containing the following information:<br/>
                    • an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;<br/>
                    • a description of the copyrighted work or other intellectual property that you claim has been infringed;<br/>
                    • a description of where the material that you claim is infringing is located on the Service;<br/>
                    • your address, telephone number, and email address;<br/>
                    • a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;<br/>
                    • a statement by you, made under penalty of perjury, that the above information in your Notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner’s behalf.<br/>
                    KeySplit’s Copyright Agent can be reached at:<br/>
                    Email: hello [at] KeySplit [dot] io
                </p>
                <p>
                    13. Binding arbitration and class action waiver<br/>
                    PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT
                </p>
                <p>
                    13.1. Initial Dispute Resolution<br/>
                    The parties shall use their best efforts to engage directly to settle any dispute, claim, question, or disagreement and engage in good faith negotiations which shall be a condition to either party initiating a lawsuit or arbitration.
                </p>
                <p>
                    13.2. Binding Arbitration<br/>
                    If the parties do not reach an agreed upon solution within a period of 30 days from the time informal dispute resolution under the Initial Dispute Resolution provision begins, then either party may initiate binding arbitration as the sole means to resolve claims, subject to the terms set forth below. Specifically, all claims arising out of or relating to these Terms (including their formation, performance and breach), the parties’ relationship with each other and/or your use of the Service shall be finally settled by binding arbitration administered by the American Arbitration Association in accordance with the provisions of its Commercial Arbitration Rules and the supplementary procedures for consumer related disputes of the American Arbitration Association (the “AAA”), excluding any rules or procedures governing or permitting class actions.<br/>
                    The arbitrator, and not any federal, state or local court or agency, shall have exclusive authority to resolve all disputes arising out of or relating to the interpretation, applicability, enforceability or formation of these Terms, including, but not limited to any claim that all or any part of these Terms are void or voidable, or whether a claim is subject to arbitration. The arbitrator shall be empowered to grant whatever relief would be available in a court under law or in equity. The arbitrator’s award shall be written, and binding on the parties and may be entered as a judgment in any court of competent jurisdiction.<br/>
                    The parties understand that, absent this mandatory provision, they would have the right to sue in court and have a jury trial. They further understand that, in some instances, the costs of arbitration could exceed the costs of litigation and the right to discovery may be more limited in arbitration than in court.<br/>
                </p>
                <p>
                    13.3. Location<br/>
                    Binding arbitration shall take place in Texas. You agree to submit to the personal jurisdiction of any federal or state court in Harris County, Texas, in order to compel arbitration, to stay proceedings pending arbitration, or to confirm, modify, vacate or enter judgment on the award entered by the arbitrator.
                </p>
                <p>
                    13.4. Class Action Waiver<br/>
                    The parties further agree that any arbitration shall be conducted in their individual capacities only and not as a class action or other representative action, and the parties expressly waive their right to file a class action or seek relief on a class basis. YOU AND KEYSPLIT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. If any court or arbitrator determines that the class action waiver set forth in this paragraph is void or unenforceable for any reason or that an arbitration can proceed on a class basis, then the arbitration provision set forth above shall be deemed null and void in its entirety and the parties shall be deemed to have not agreed to arbitrate disputes.
                </p>
                <p>
                    13.5. Exception - Litigation of Intellectual Property and Small Claims Court Claims<br/>
                    Notwithstanding the parties’ decision to resolve all disputes through arbitration, either party may bring an action in state or federal court to protect its intellectual property rights (“intellectual property rights” means patents, copyrights, moral rights, trademarks, and trade secrets, but not privacy or publicity rights). Either party may also seek relief in a small claims court for disputes or claims within the scope of that court’s jurisdiction.
                </p>
                <p>
                    13.6. 30-Day Right to Opt Out<br/>
                    You have the right to opt-out and not be bound by the arbitration and class action waiver provisions set forth above by emailing notice of your decision to opt-out to the following address: hello@KeySplit.io. The notice must be sent within 30 days of March 29, 2018 or your first use of the Service, whichever is later, otherwise you shall be bound to arbitrate disputes in accordance with the terms of those paragraphs. If you opt-out of these arbitration provisions, KeySplit also will not be bound by them.
                </p>
                <p>
                    13.7. Changes to this Section<br/>
                    KeySplit will provide 30-days’ notice of any changes to this section. Changes will become effective on the 30th day, and will apply prospectively only to any claims arising after the 30th day.<br/>
                    For any dispute not subject to arbitration you and KeySplit agree to submit to the personal and exclusive jurisdiction of and venue in the federal and state courts located in Houston, Texas. You further agree to accept service of process by mail, and hereby waive any and all jurisdictional and venue defenses otherwise available.<br/>
                    The Terms and the relationship between you and KeySplit shall be governed by the laws of the State of Texas without regard to conflict of law provisions.
                </p>
                <p>
                    14. GENERAL INFORMATION<br/>
                    14.1. Entire Agreement<br/>
                    These Terms (and any additional terms, rules and conditions of participation that KeySplit may post on the Service) constitute the entire agreement between you and KeySplit with respect to the Service and supersedes any prior agreements, oral or written, between you and KeySplit. In the event of a conflict between these Terms and the additional terms, rules and conditions of participation, the latter will prevail over the Terms to the extent of the conflict.
                </p>
                <p>
                    14.2. Waiver and Severability of Terms<br/>
                    The failure of KeySplit to exercise or enforce any right or provision of the Terms shall not constitute a waiver of such right or provision. If any provision of the Terms is found by an arbitrator or court of competent jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should endeavor to give effect to the parties’ intentions as reflected in the provision, and the other provisions of the Terms remain in full force and effect.
                </p>
                <p>
                    14.3. Statute of Limitations<br/>
                    You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Service or the Terms must be filed within one (1) year after such claim or cause of action arose or be forever barred.
                </p>
                <p>
                    14.4. Section Titles<br/>
                    The section titles in the Terms are for convenience only and have no legal or contractual effect.
                </p>
                <p>
                    14.5. Communications<br/>
                    Users with questions, complaints or claims with respect to the Service may contact us using the relevant contact information set forth above.
                </p>
            </div>
        )
    }
}

export default Terms;
