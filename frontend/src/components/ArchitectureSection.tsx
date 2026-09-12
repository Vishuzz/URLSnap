import React, { useState } from 'react';
import { Database, ShieldCheck, Cpu, ArrowRight, Workflow, CheckCircle2 } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vpc' | 'asg' | 'rds' | 'cicd'>('overview');

  return (
    <div id="architecture" className="w-full max-w-6xl mx-auto my-16 px-4 sm:px-6">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#f5efe6] border border-[#e6dccf] shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-[#e2d6c6]">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#8c7a6b] uppercase block mb-2">
              Cloud Infrastructure & System Design
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1c1613] leading-tight">
              Production-Grade <em className="italic font-serif font-normal text-[#8c432d]">AWS Architecture</em>.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6e6054] max-w-sm leading-relaxed">
            Multi-AZ VPC deployment with Load Balancing, Auto Scaling, isolated RDS MySQL, and automated zero-downtime CI/CD.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1c1613] text-white shadow-sm'
                : 'bg-[#eae2d5] text-[#6e6054] hover:bg-[#ded4c5]'
            }`}
          >
            System Diagram Flow
          </button>
          <button
            onClick={() => setActiveTab('vpc')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'vpc'
                ? 'bg-[#1c1613] text-white shadow-sm'
                : 'bg-[#eae2d5] text-[#6e6054] hover:bg-[#ded4c5]'
            }`}
          >
            Multi-AZ VPC & Security
          </button>
          <button
            onClick={() => setActiveTab('asg')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'asg'
                ? 'bg-[#1c1613] text-white shadow-sm'
                : 'bg-[#eae2d5] text-[#6e6054] hover:bg-[#ded4c5]'
            }`}
          >
            Auto Scaling EC2 (Go App)
          </button>
          <button
            onClick={() => setActiveTab('rds')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'rds'
                ? 'bg-[#1c1613] text-white shadow-sm'
                : 'bg-[#eae2d5] text-[#6e6054] hover:bg-[#ded4c5]'
            }`}
          >
            RDS MySQL Multi-AZ
          </button>
          <button
            onClick={() => setActiveTab('cicd')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cicd'
                ? 'bg-[#1c1613] text-white shadow-sm'
                : 'bg-[#eae2d5] text-[#6e6054] hover:bg-[#ded4c5]'
            }`}
          >
            GitHub Actions CI/CD
          </button>
        </div>

        {/* Tab 1: System Diagram Flow */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Visual Flow Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Node 1 */}
              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e2d6c6] text-center shadow-2xs">
                <div className="inline-flex p-3 rounded-xl bg-[#eae2d5] text-[#8c432d] mb-3">
                  <Workflow className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-serif text-[#1c1613] font-bold">1. Public Users</h4>
                <p className="text-[11px] text-[#78695d] mt-1">HTTP requests (`/shorten`, `/{'{code}'}`)</p>
              </div>

              <div className="hidden md:flex justify-center text-[#b8a798]">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Node 2 */}
              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e2d6c6] text-center shadow-2xs">
                <div className="inline-flex p-3 rounded-xl bg-[#eae2d5] text-[#8c432d] mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-serif text-[#1c1613] font-bold">2. AWS ALB (Port 80)</h4>
                <p className="text-[11px] text-[#78695d] mt-1">Health Check `/health` & Load Balancing</p>
              </div>

              <div className="hidden md:flex justify-center text-[#b8a798]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Compute Node */}
              <div className="p-6 rounded-2xl bg-[#1c0f22] border border-[#3b1d40] text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#311636] text-[#e69880]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif text-white">3. Auto Scaling Group (EC2)</h4>
                    <span className="text-xs text-[#a8998c]">Private Subnet · Port 8080 · Systemd</span>
                  </div>
                </div>
                <p className="text-xs text-[#c9b8aa] leading-relaxed">
                  Go microservice executes Base62 encoding in &lt;1ms. Automatically scales between 2 to 4 instances across Availability Zones (`ap-south-1a`, `ap-south-1b`).
                </p>
              </div>

              {/* Database Node */}
              <div className="p-6 rounded-2xl bg-[#1c0f22] border border-[#3b1d40] text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#311636] text-[#e69880]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif text-white">4. Amazon RDS MySQL</h4>
                    <span className="text-xs text-[#a8998c]">Private Subnet · Port 3306 · Multi-AZ</span>
                  </div>
                </div>
                <p className="text-xs text-[#c9b8aa] leading-relaxed">
                  Stores long URL ↔ short code mappings persistently. Inbound security group rule restricts access strictly to EC2 Security Group.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: VPC & Security */}
        {activeTab === 'vpc' && (
          <div className="space-y-4 text-xs text-[#6e6054] animate-fade-in-up">
            <h4 className="text-lg font-serif text-[#1c1613]">Isolated Multi-AZ Network Architecture</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>VPC CIDR Block</strong>: <code>10.0.0.0/16</code> in AWS Region <code>ap-south-1</code> (Mumbai).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Public Subnets (2)</strong>: Hosts Application Load Balancer and NAT Gateway with Elastic IP.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Private Subnets (4)</strong>: Hosts EC2 application instances and RDS MySQL with zero public IPv4 visibility.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Security Group Chaining</strong>: ALB SG (Port 80) ➔ EC2 SG (Port 8080 from ALB) ➔ RDS SG (Port 3306 from EC2).</span>
              </li>
            </ul>
          </div>
        )}

        {/* Tab 3: ASG */}
        {activeTab === 'asg' && (
          <div className="space-y-4 text-xs text-[#6e6054] animate-fade-in-up">
            <h4 className="text-lg font-serif text-[#1c1613]">High-Availability Auto Scaling Compute</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Launch Template</strong>: Amazon Linux 2023 with Systemd service startup (`/opt/url-shortener/app`).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Capacity Controls</strong>: Min 2, Desired 2, Max 4 instances for automatic self-healing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Self-Healing</strong>: Unhealthy EC2 instances are terminated automatically and replaced without downtime.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Tab 4: RDS */}
        {activeTab === 'rds' && (
          <div className="space-y-4 text-xs text-[#6e6054] animate-fade-in-up">
            <h4 className="text-lg font-serif text-[#1c1613]">Managed Relational Storage (MySQL 8.0)</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Multi-AZ Replication</strong>: Synchronous standby instance in secondary availability zone for high availability.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Atomic Counter Increments</strong>: Click statistics updated safely using <code>UPDATE urls SET click_count = click_count + 1</code>.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Tab 5: CI/CD */}
        {activeTab === 'cicd' && (
          <div className="space-y-4 text-xs text-[#6e6054] animate-fade-in-up">
            <h4 className="text-lg font-serif text-[#1c1613]">Zero-Downtime GitHub Actions Automation</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Job 1 (`test-and-build`)</strong>: Runs <code>go test -v ./...</code> and cross-compiles Linux AMD64 binary.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c432d] shrink-0 mt-0.5" />
                <span><strong>Job 2 (`deploy-aws`)</strong>: Authenticates via AWS IAM secrets and triggers <code>aws autoscaling start-instance-refresh</code>.</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
